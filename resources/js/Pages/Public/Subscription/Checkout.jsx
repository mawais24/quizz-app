import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { ArrowLeft, CreditCard } from "lucide-react";

function CheckoutForm({ plan }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!stripe || !elements) return;
        setLoading(true);

        // 1) create a PaymentMethod from the card
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
            billing_details: {}, // optionally add name/email
        });

        if (error) {
            console.error(error);
            alert(error.message);
            setLoading(false);
            return;
        }

        // 2) post payment_method_id to your Laravel route
        router.post(
            route("subscription.process", { plan: plan.id }),
            {
                plan_id: plan.id,
                payment_method_id: paymentMethod.id,
            },
            {
                onStart: () => console.log("Submitting subscription..."),
                onError: (errors) => {
                    console.error("Validation/Server errors:", errors);
                    alert(Object.values(errors).join("\n"));
                },
                onSuccess: (page) => {
                    console.log("Subscribed!", page);
                },
                onFinish: () => setLoading(false),
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="space-y-4">
            <div className="p-4 rounded border bg-white">
                <CardElement options={{ hidePostalCode: true }} />
            </div>
            <Button
                className="w-full"
                onClick={handleSubscribe}
                disabled={loading || !stripe}
            >
                {loading ? (
                    "Processing..."
                ) : (
                    <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay {(plan.currency || "USD").toUpperCase()}{" "}
                        {Number(plan.price || 0).toFixed(2)}
                    </>
                )}
            </Button>
        </div>
    );
}

export default function SubscriptionCheckout({ plan, user, stripeKey }) {
    const stripePromise = loadStripe(stripeKey);

    return (
        <>
            <Head title={`Checkout — ${plan.name}`} />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route("subscription.plans")}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Plans
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Checkout</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* plan summary ... */}

                            {/* Stripe Elements wrapper */}
                            <Elements stripe={stripePromise}>
                                <CheckoutForm plan={plan} />
                            </Elements>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
