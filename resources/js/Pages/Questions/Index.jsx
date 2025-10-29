import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";

export default function Index({ quiz, questions, auth }) {
    const remove = (qId) => {
        if (confirm("Delete this question?")) {
            router.delete(
                route("admin.quizzes.questions.destroy", [quiz.id, qId]),
                {
                    preserveScroll: true,
                }
            );
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Questions · ${quiz.title}`} />
            <div className="py-8 max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">
                        Questions · {quiz.title}
                    </h1>
                    <div className="flex gap-2">
                        <Link href={route("admin.quizzes.index")}>
                            <Button variant="outline">Back to Quizzes</Button>
                        </Link>
                        <Link
                            href={route(
                                "admin.quizzes.questions.create",
                                quiz.id
                            )}
                        >
                            <Button>Add Question</Button>
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto border rounded">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                                    #
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                                    Question
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                                    Correct
                                </th>
                                <th className="px-4 py-2 text-right text-xs font-medium uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {questions.length ? (
                                questions.map((q, i) => (
                                    <tr key={q.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm">
                                            {q.order ?? 0}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="text-sm font-medium">
                                                {q.question_text}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                A) {q.option_a} · B){" "}
                                                {q.option_b} · C) {q.option_c} ·
                                                D) {q.option_d}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            {q.correct_option}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route(
                                                        "admin.quizzes.questions.edit",
                                                        [quiz.id, q.id]
                                                    )}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => remove(q.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="px-4 py-8 text-center text-gray-500"
                                        colSpan="4"
                                    >
                                        No questions yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
