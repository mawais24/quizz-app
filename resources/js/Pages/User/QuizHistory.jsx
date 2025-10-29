import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { History, Trophy, XCircle, ArrowLeft } from "lucide-react";
import MainLayout from "@/Layouts/GuestLayout";

export default function UserQuizHistory({
    auth,
    attempts, // paginated { data: [{ id, quiz: {id,title}, score, passed, total_questions, created_at }, ...], links, last_page }
}) {
    return (
        <MainLayout auth={auth}>
            <Head title="My Quiz History" />

            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-5 h-5" /> My Quiz History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {attempts.data.length === 0 ? (
                                <div className="text-center p-10 text-gray-600">
                                    No attempts yet. Start a quiz to see your
                                    results here.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Quiz</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-center">
                                                    Score
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Status
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {attempts.data.map((a) => (
                                                <TableRow key={a.id}>
                                                    <TableCell>
                                                        {a.quiz?.title ||
                                                            "Untitled Quiz"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {a.created_at_human ||
                                                            a.created_at}
                                                    </TableCell>
                                                    <TableCell className="text-center font-semibold">
                                                        {a.status ===
                                                        "completed"
                                                            ? `${a.score}%`
                                                            : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {a.status ===
                                                        "completed" ? (
                                                            <Badge
                                                                variant={
                                                                    a.passed
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                                className="inline-flex items-center"
                                                            >
                                                                {a.passed ? (
                                                                    <Trophy className="w-3 h-3 mr-1 text-yellow-500" />
                                                                ) : (
                                                                    <XCircle className="w-3 h-3 mr-1" />
                                                                )}
                                                                {a.passed
                                                                    ? "Passed"
                                                                    : "Failed"}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
                                                                In Progress
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {a.status ===
                                                        "completed" ? (
                                                            <Link
                                                                href={route(
                                                                    "quiz.result",
                                                                    {
                                                                        quiz: a.quiz_id,
                                                                        attempt:
                                                                            a.id,
                                                                    }
                                                                )}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                >
                                                                    View Result
                                                                </Button>
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={route(
                                                                    "public.quiz.show",
                                                                    a.quiz_id
                                                                )}
                                                            >
                                                                <Button size="sm">
                                                                    Resume
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {attempts.last_page > 1 && (
                                <div className="mt-6 flex justify-center gap-2">
                                    {attempts.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || "#"}
                                            className={`px-3 py-2 rounded ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                                            } ${
                                                !link.url
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            preserveState
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
