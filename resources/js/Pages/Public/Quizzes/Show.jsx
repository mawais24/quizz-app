import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Lock,
    Clock,
    Target,
    Users,
    ShieldCheck,
    ArrowLeft,
} from "lucide-react";

export default function PublicQuizShow({
    quiz,
    hasActiveSubscription,
    lastAttempt,
    canStart,
    // user,  // <-- remove this prop; we'll read from shared props
}) {
    const { auth } = usePage().props;
    const user = auth?.user; // <-- this is the logged-in user

    const handleStart = () => {
        router.post(route("quiz.start", quiz.id));
    };

    return (
        <>
            <Head title={quiz.title} />
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route("public.quizzes")}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to
                            Quizzes
                        </Link>
                    </div>

                    <Card>
                        <CardHeader className="space-y-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">
                                    {quiz.title}
                                </CardTitle>
                                <div className="flex gap-2">
                                    {quiz.type === "premium" ? (
                                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                            Premium
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">Free</Badge>
                                    )}
                                </div>
                            </div>
                            {quiz.category && (
                                <Badge variant="outline" className="w-fit">
                                    {quiz.category.name}
                                </Badge>
                            )}
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <p className="text-gray-700">
                                {quiz.description ||
                                    "No description available."}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />{" "}
                                    {quiz.time_limit
                                        ? `${quiz.time_limit} min`
                                        : "No time limit"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Passing:{" "}
                                    {quiz.passing_score}%
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />{" "}
                                    {quiz.total_questions} questions
                                </div>
                                {quiz.difficulty && (
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" />{" "}
                                        {quiz.difficulty}
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {user ? (
                                <div className="space-y-3">
                                    {lastAttempt && (
                                        <div className="p-3 rounded-md bg-gray-50 text-sm flex items-center justify-between">
                                            <span className="text-gray-700">
                                                Last attempt:{" "}
                                                {lastAttempt.status ===
                                                "completed"
                                                    ? `${lastAttempt.score}%`
                                                    : "In Progress"}
                                            </span>
                                            {lastAttempt?.status ===
                                                "in_progress" && (
                                                <Link
                                                    href={route("quiz.take", {
                                                        quiz: quiz.id,
                                                        attempt: lastAttempt.id,
                                                    })}
                                                >
                                                    <Button variant="outline">
                                                        Resume
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    )}

                                    {quiz.type === "premium" &&
                                        !hasActiveSubscription && (
                                            <Link
                                                href={route(
                                                    "subscription.plans"
                                                )}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Unlock with Premium
                                                </Button>
                                            </Link>
                                        )}

                                    {canStart && (
                                        <Button
                                            className="w-full"
                                            onClick={handleStart}
                                        >
                                            Start Quiz
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600">
                                        Sign up or log in to track your progress
                                        and save attempts.
                                    </p>
                                    <div className="flex gap-2">
                                        <Link href={route("login")}>
                                            <Button variant="outline">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href={route("register")}>
                                            <Button>Create Account</Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
