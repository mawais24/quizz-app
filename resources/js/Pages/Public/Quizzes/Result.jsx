import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MainLayout from "@/Layouts/GuestLayout";
import {
    Trophy,
    XCircle,
    CheckCircle2,
    ArrowLeft,
    History,
    Target,
} from "lucide-react";

export default function PublicQuizResult({
    auth,
    featuredQuizzes,
    categories,
    testimonials,
    quiz,
    attempt, // { score, passed, correct_answers, wrong_answers, total_questions, time_spent_seconds }
}) {
    // Simple function to ensure score is properly formatted
    const formatScore = (score) => {
        if (score === null || score === undefined) return "0.00";

        // If it's already a string with proper format, return it
        if (typeof score === "string" && score.includes(".")) return score;

        // If it's a number or numeric string, format it
        const numericScore = parseFloat(score);
        if (!isNaN(numericScore)) {
            return numericScore.toFixed(2);
        }

        // Fallback - calculate from correct answers
        if (attempt.total_questions && attempt.total_questions > 0) {
            return (
                (attempt.correct_answers / attempt.total_questions) *
                100
            ).toFixed(2);
        }

        return "0.00";
    };

    // Format the score for display
    const displayScore = formatScore(attempt.score);

    // For Progress component, ensure we have a number
    const progressValue = parseFloat(displayScore);

    const accuracy = attempt.total_questions
        ? Math.round((attempt.correct_answers / attempt.total_questions) * 100)
        : 0;

    const formatTime = (sec) => {
        if (!sec && sec !== 0) return "-";
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${String(s).padStart(2, "0")}`;
    };

    console.log("Attempt data:", {
        rawScore: attempt.score,
        scoreType: typeof attempt.score,
        displayScore,
        correctAnswers: attempt.correct_answers,
        totalQuestions: attempt.total_questions,
    });

    return (
        <MainLayout auth={auth}>
            <Head title={`Result: ${quiz.title}`} />

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
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Your Result — {quiz.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 rounded-lg bg-white border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Score
                                        </span>
                                        <Target className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="mt-2 text-3xl font-bold">
                                        {displayScore}%
                                    </div>
                                    <Progress
                                        value={progressValue}
                                        className="mt-3"
                                    />
                                </div>

                                <div className="p-4 rounded-lg bg-white border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Status
                                        </span>
                                        {attempt.passed ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <Badge
                                            variant={
                                                attempt.passed
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {attempt.passed
                                                ? "Passed"
                                                : "Failed"}
                                        </Badge>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Passing: {quiz.passing_score}%
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-white border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Time Spent
                                        </span>
                                        <History className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="mt-2 text-3xl font-semibold">
                                        {formatTime(attempt.time_spent_seconds)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                    <div className="text-sm text-gray-600">
                                        Correct
                                    </div>
                                    <div className="mt-2 text-2xl font-bold text-green-700">
                                        {attempt.correct_answers || 0}
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                    <div className="text-sm text-gray-600">
                                        Wrong
                                    </div>
                                    <div className="mt-2 text-2xl font-bold text-red-700">
                                        {attempt.wrong_answers || 0}
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 border">
                                    <div className="text-sm text-gray-600">
                                        Accuracy
                                    </div>
                                    <div className="mt-2 text-2xl font-bold">
                                        {accuracy || 0}%
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link href={route("public.quiz.show", quiz.id)}>
                                    <Button>Retake Quiz</Button>
                                </Link>
                                {attempt.user_id && (
                                    <Link href={route("user.quiz-history")}>
                                        <Button variant="outline">
                                            View Quiz History
                                        </Button>
                                    </Link>
                                )}
                                {attempt.passed && (
                                    <Button
                                        variant="secondary"
                                        className="inline-flex items-center"
                                    >
                                        <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                                        Great job!
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
