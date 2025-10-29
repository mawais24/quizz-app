import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ShieldCheck, CreditCard } from "lucide-react";
import MainLayout from "@/Layouts/GuestLayout";

export default function SubscriptionPlans({
    auth,
    plans, // array of {id, name, description, price, currency, interval, days, is_active}
    activePlanId, // optional: user’s current plan id
    hasActiveSubscription, // boolean
}) {
    const formatPrice = (p) =>
        `${(p.currency || "USD").toUpperCase()} ${Number(p.price || 0).toFixed(
            2
        )}`;

    return (
        <MainLayout auth={auth}>
            <Head title="Subscription Plans" />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Unlock Premium Quizzes
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Choose a plan that fits your learning journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan) => {
                            const isCurrent =
                                activePlanId === plan.id &&
                                hasActiveSubscription;
                            return (
                                <Card
                                    key={plan.id}
                                    className={
                                        isCurrent
                                            ? "border-2 border-blue-600"
                                            : ""
                                    }
                                >
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl">
                                                {plan.name}
                                            </CardTitle>
                                            {plan.is_active ? (
                                                <Badge className="bg-green-600">
                                                    Available
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Unavailable
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            <div className="text-3xl font-bold">
                                                {formatPrice(plan)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {plan.interval === "lifetime"
                                                    ? "Lifetime"
                                                    : `${plan.days} days`}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-gray-700">
                                            {plan.description || "—"}
                                        </p>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                Access premium quizzes
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                Track results & history
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-blue-600" />
                                                Secure payments
                                            </div>
                                            {!plan.is_active && (
                                                <div className="flex items-center gap-2 text-red-600">
                                                    <XCircle className="w-4 h-4" />
                                                    Temporarily unavailable
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            {isCurrent ? (
                                                <Button
                                                    className="w-full"
                                                    variant="outline"
                                                >
                                                    Current Plan
                                                </Button>
                                            ) : (
                                                <Link
                                                    href={route(
                                                        "subscription.checkout",
                                                        { plan: plan.id }
                                                    )}
                                                >
                                                    <Button className="w-full">
                                                        <CreditCard className="w-4 h-4 mr-2" />
                                                        Choose {plan.name}
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
