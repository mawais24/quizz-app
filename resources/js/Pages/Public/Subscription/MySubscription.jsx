import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Crown, XCircle } from "lucide-react";
import MainLayout from "@/Layouts/GuestLayout";

export default function MySubscription({
    auth,
    currentSubscription,
    subscriptionHistory,
}) {
    const { flash } = usePage().props;
    const [loading, setLoading] = useState(false);

    const cancel = () => {
        if (!currentSubscription) return;
        if (!confirm("Are you sure you want to cancel your subscription?"))
            return;

        setLoading(true);
        router.post(
            route("subscription.cancel"),
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

    return (
        <MainLayout auth={auth}>
            <Head title="My Subscription" />
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href={route("subscription.plans")}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Plans
                        </Link>
                        {flash?.success && (
                            <span className="text-sm text-green-700">
                                {flash.success}
                            </span>
                        )}
                        {flash?.error && (
                            <span className="text-sm text-red-700">
                                {flash.error}
                            </span>
                        )}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Crown className="w-5 h-5" />
                                My Subscription
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {currentSubscription ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-lg font-medium">
                                                {currentSubscription
                                                    .subscription_plan?.name ??
                                                    "Plan"}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {
                                                    currentSubscription
                                                        .subscription_plan
                                                        ?.description
                                                }
                                            </div>
                                            <div className="text-sm text-gray-700 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    Started:{" "}
                                                    {fmtDate(
                                                        currentSubscription.starts_at
                                                    )}
                                                </span>
                                                <span className="mx-2">•</span>
                                                <span>
                                                    Ends:{" "}
                                                    {currentSubscription.ends_at
                                                        ? fmtDate(
                                                              currentSubscription.ends_at
                                                          )
                                                        : "Never (lifetime)"}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                currentSubscription.status ===
                                                "active"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {currentSubscription.status ??
                                                "unknown"}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    <div className="flex gap-2">
                                        {currentSubscription.status ===
                                        "active" ? (
                                            <Button
                                                variant="destructive"
                                                onClick={cancel}
                                                disabled={loading}
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                {loading
                                                    ? "Cancelling..."
                                                    : "Cancel Subscription"}
                                            </Button>
                                        ) : (
                                            <Link
                                                href={route(
                                                    "subscription.plans"
                                                )}
                                            >
                                                <Button>Choose a Plan</Button>
                                            </Link>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-gray-700">
                                        You don’t have an active subscription.
                                    </p>
                                    <Link href={route("subscription.plans")}>
                                        <Button>Browse Plans</Button>
                                    </Link>
                                </div>
                            )}

                            <Separator />

                            <div>
                                <div className="font-medium mb-3">History</div>
                                {subscriptionHistory?.length ? (
                                    <ul className="space-y-2">
                                        {subscriptionHistory.map((s) => (
                                            <li
                                                key={s.id}
                                                className="flex items-center justify-between rounded border bg-white p-3"
                                            >
                                                <div className="space-y-0.5">
                                                    <div className="text-sm font-medium">
                                                        {s.subscription_plan
                                                            ?.name ?? "Plan"}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {fmtDate(s.starts_at)} —{" "}
                                                        {s.ends_at
                                                            ? fmtDate(s.ends_at)
                                                            : "—"}
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={
                                                        s.status === "active"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {s.status}
                                                </Badge>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-600">
                                        No previous subscriptions.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
