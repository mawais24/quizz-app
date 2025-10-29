import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Show({ quiz, auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Quiz: ${quiz.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">
                                        {quiz.title}
                                    </CardTitle>
                                    <div className="flex gap-2 mt-2">
                                        <Badge
                                            variant={
                                                quiz.type === "premium"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {quiz.type}
                                        </Badge>
                                        <Badge
                                            variant={
                                                quiz.is_active
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {quiz.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                        <Badge variant="outline">
                                            {quiz.category.name}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route("quizzes.edit", quiz.id)}>
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Link href={route("quizzes.index")}>
                                        <Button variant="outline">
                                            Back to List
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Description */}
                            {quiz.description && (
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Description
                                    </h3>
                                    <p className="text-gray-600">
                                        {quiz.description}
                                    </p>
                                </div>
                            )}

                            {/* Quiz Settings */}
                            <div>
                                <h3 className="font-semibold mb-3">
                                    Quiz Settings
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">
                                            Time Limit:
                                        </span>
                                        <span className="font-medium">
                                            {quiz.time_limit
                                                ? `${quiz.time_limit} minutes`
                                                : "No limit"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">
                                            Passing Score:
                                        </span>
                                        <span className="font-medium">
                                            {quiz.passing_score}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">
                                            Maximum Attempts:
                                        </span>
                                        <span className="font-medium">
                                            {quiz.max_attempts || "Unlimited"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">
                                            Points per Question:
                                        </span>
                                        <span className="font-medium">
                                            {quiz.points_per_question}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">
                                            Total Questions:
                                        </span>
                                        <span className="font-medium">
                                            {quiz.total_questions ||
                                                "No questions yet"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">
                                            Total Points:
                                        </span>
                                        <span className="font-medium">
                                            {quiz.total_questions
                                                ? quiz.total_questions *
                                                  quiz.points_per_question
                                                : 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quiz Options */}
                            <div>
                                <h3 className="font-semibold mb-3">
                                    Quiz Options
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-4 h-4 rounded ${
                                                quiz.shuffle_questions
                                                    ? "bg-green-500"
                                                    : "bg-gray-300"
                                            }`}
                                        ></div>
                                        <span>
                                            Shuffle questions for each attempt
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-4 h-4 rounded ${
                                                quiz.show_correct_answers
                                                    ? "bg-green-500"
                                                    : "bg-gray-300"
                                            }`}
                                        ></div>
                                        <span>
                                            Show correct answers after
                                            completion
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span>Created: </span>
                                        <span className="font-medium">
                                            {new Date(
                                                quiz.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Last Updated: </span>
                                        <span className="font-medium">
                                            {new Date(
                                                quiz.updated_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-6 border-t">
                                <div className="flex justify-center gap-4">
                                    <Button size="lg" disabled>
                                        Add Questions (Coming Soon)
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        disabled
                                    >
                                        Preview Quiz (Coming Soon)
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
