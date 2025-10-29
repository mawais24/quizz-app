<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Models\PaymentTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        // services.stripe.secret should be set in config/services.php
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Show subscription plans
     */
    public function plans()
    {
        $plans = SubscriptionPlan::active()
            ->orderBy('price')
            ->get();

        $user = Auth::user();
        $currentSubscription = null;

        if ($user) {
            $currentSubscription = UserSubscription::where('user_id', $user->id)
                ->active()
                ->with('subscriptionPlan')
                ->first();
        }

        return Inertia::render('Public/Subscription/Plans', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
            'stripeKey' => config('services.stripe.key'), // publishable key for Stripe Elements
        ]);
    }

    /**
     * Process subscription checkout page
     */
    public function checkout(Request $request, SubscriptionPlan $plan)
    {
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('info', 'Please login to subscribe to a plan.');
        }

        $user = Auth::user();

        // Already has an active subscription?
        $existingSubscription = UserSubscription::where('user_id', $user->id)
            ->active()
            ->first();

        if ($existingSubscription) {
            return redirect()->route('subscription.my')
                ->with('info', 'You already have an active subscription.');
        }

        return Inertia::render('Public/Subscription/Checkout', [
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $plan->price,
                'currency' => $plan->currency ?? config('cashier.currency', env('STRIPE_CURRENCY', 'usd')),
                'interval' => $plan->interval,
                'days' => $plan->days,
                'description' => $plan->description,
            ],
            'stripeKey' => config('services.stripe.key'),
        ]);
    }

    /**
     * Process payment and activate subscription
     * POST /subscription/plan/{plan}/process  (name: subscription.process)
     */
    public function processPayment(Request $request, SubscriptionPlan $plan)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        // Free / zero-priced plan -> no payment needed
        if (empty($plan->price) || $plan->price <= 0) {
            $subscription = $this->activateSubscription($user->id, $plan, null, null);
            $this->recordTransaction($user->id, $subscription->id, 0, $plan->currency ?? 'USD', 'completed', null, null);

            return redirect()->route('subscription.my')
                ->with('success', 'Subscription activated!');
        }

        // Paid plan -> requires PaymentMethod from client (Stripe Elements)
        $validated = $request->validate([
            'payment_method_id' => 'required|string',
        ]);

        try {
            // 1) Create or get Stripe Customer
            $stripeCustomer = $this->createOrGetStripeCustomer($user);

            // 2) Attach payment method & set as default
            $paymentMethod = \Stripe\PaymentMethod::retrieve($validated['payment_method_id']);
            $paymentMethod->attach(['customer' => $stripeCustomer->id]);

            Customer::update($stripeCustomer->id, [
                'invoice_settings' => ['default_payment_method' => $validated['payment_method_id']]
            ]);

            // 3) Create & confirm PaymentIntent
            $amount = (int) round($plan->price * 100); // cents
            $currency = $plan->currency ?: (string) env('STRIPE_CURRENCY', 'usd');

            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'customer' => $stripeCustomer->id,
                'payment_method' => $validated['payment_method_id'],
                'off_session' => true,
                'confirm' => true,
                'description' => "Subscription to {$plan->name}",
                'metadata' => [
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                ],
                'automatic_payment_methods' => ['enabled' => true],
            ]);

            if ($paymentIntent->status === 'requires_action') {
                // For a full SCA flow, return the client_secret and confirm on client.
                return back()->withErrors(['payment' => 'Additional authentication required. Please try a different card for now.']);
            }

            if ($paymentIntent->status === 'succeeded') {
                // 4) Activate subscription window
                $subscription = $this->activateSubscription(
                    $user->id,
                    $plan,
                    $stripeCustomer->id,
                    [
                        'payment_intent_id' => $paymentIntent->id,
                        'payment_method_id' => $validated['payment_method_id'],
                    ]
                );

                // 5) Record payment transaction
                $this->recordTransaction(
                    $user->id,
                    $subscription->id,
                    $plan->price,
                    strtoupper($currency),
                    'completed',
                    $paymentIntent->id,
                    $paymentIntent->toArray()
                );

                return redirect()->route('subscription.my')
                    ->with('success', 'Subscription activated successfully!');
            }

            return back()->withErrors(['payment' => 'Unable to process payment. Please try again.']);

        } catch (\Stripe\Exception\CardException $e) {
            return back()->withErrors(['payment' => 'Payment failed: ' . $e->getMessage()]);
        } catch (\Throwable $e) {
            Log::error('Subscription payment failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->withErrors(['payment' => 'Payment processing failed. Please try again.']);
        }
    }

    /**
     * Show user's subscription details
     * GET /subscription/my-subscription   (name: subscription.my)
     */
    public function mySubscription()
    {
        $user = Auth::user();

        $currentSubscription = UserSubscription::where('user_id', $user->id)
            ->with(['subscriptionPlan', 'transactions'])
            ->latest()
            ->first();

        $subscriptionHistory = UserSubscription::where('user_id', $user->id)
            ->with('subscriptionPlan')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Public/Subscription/MySubscription', [
            'currentSubscription' => $currentSubscription,
            'subscriptionHistory' => $subscriptionHistory
        ]);
    }

    /**
     * Cancel subscription (keeps access until ends_at)
     * POST /subscription/cancel (name: subscription.cancel)
     */
    public function cancel(Request $request)
    {
        $user = Auth::user();

        $subscription = UserSubscription::where('user_id', $user->id)
            ->active()
            ->first();

        if (!$subscription) {
            return back()->with('error', 'No active subscription found.');
        }

        $subscription->cancel();

        return back()->with('success', 'Subscription cancelled. You can continue using premium features until ' . $subscription->ends_at->format('M d, Y'));
    }

    /**
     * Create or get Stripe customer
     */
    private function createOrGetStripeCustomer($user)
    {
        $existingCustomer = UserSubscription::where('user_id', $user->id)
            ->whereNotNull('stripe_customer_id')
            ->latest()
            ->first();

        if ($existingCustomer && $existingCustomer->stripe_customer_id) {
            try {
                return Customer::retrieve($existingCustomer->stripe_customer_id);
            } catch (\Throwable $e) {
                // Not found remotely; fall through to create a new one.
            }
        }

        return Customer::create([
            'email' => $user->email,
            'name'  => $user->name,
            'metadata' => ['user_id' => $user->id],
        ]);
    }

    /**
     * Activate (or update) user's subscription for a plan
     */
    private function activateSubscription(
        int $userId,
        SubscriptionPlan $plan,
        ?string $stripeCustomerId = null,
        ?array $stripeData = null
    ): UserSubscription {
        $startsAt = now();
        $endsAt = $plan->interval === 'lifetime' ? null : now()->addDays((int) ($plan->days ?? 0));

        return UserSubscription::updateOrCreate(
            [
                'user_id' => $userId,
                'subscription_plan_id' => $plan->id,
            ],
            [
                'status' => 'active',
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'stripe_customer_id' => $stripeCustomerId,
                'stripe_data' => $stripeData,
            ]
        );
    }

    /**
     * Record a payment transaction (optional table)
     */
    private function recordTransaction(
        int $userId,
        int $userSubscriptionId,
        float $amount,
        string $currency,
        string $status,
        ?string $paymentIntentId,
        $stripeResponse
    ): void {
        // If you don't use this table, remove calls to this method.
        PaymentTransaction::create([
            'user_id' => $userId,
            'user_subscription_id' => $userSubscriptionId,
            'amount' => $amount,
            'currency' => $currency,
            'status' => $status,
            'payment_method' => 'stripe',
            'stripe_payment_intent_id' => $paymentIntentId,
            'stripe_response' => $stripeResponse,
        ]);
    }
}
