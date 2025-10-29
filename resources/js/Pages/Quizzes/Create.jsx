import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function Create({ categories = [], auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        category_id: "",
        type: "free", // free | premium
        time_limit: "", // minutes ('' = null)
        passing_score: 60, // 1..100
        max_attempts: "", // '' = null (unlimited)
        is_active: true,
        shuffle_questions: false,
        show_correct_answers: true,
        points_per_question: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.quizzes.store"), {
            preserveScroll: true,
            onSuccess: () => reset("title", "description"),
        });
    };

    const numberOrNull = (val) => {
        // convert empty string to null, otherwise to number
        if (val === "" || val === null || val === undefined) return "";
        return val;
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Create Quiz" />
            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle className="text-2xl">
                                Create Quiz
                            </CardTitle>
                            <div className="flex gap-2">
                                <Link href={route("admin.quizzes.index")}>
                                    <Button variant="outline">
                                        Back to List
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Info */}
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            placeholder="e.g., JavaScript Basics Quiz"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label htmlFor="description">
                                            Description (optional)
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Short summary or instructions for the quiz"
                                            rows={4}
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="category_id">
                                            Category
                                        </Label>
                                        <select
                                            id="category_id"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={data.category_id}
                                            onChange={(e) =>
                                                setData(
                                                    "category_id",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select a category
                                            </option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.category_id}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="type">
                                            Access Type
                                        </Label>
                                        <select
                                            id="type"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={data.type}
                                            onChange={(e) =>
                                                setData("type", e.target.value)
                                            }
                                        >
                                            <option value="free">Free</option>
                                            <option value="premium">
                                                Premium
                                            </option>
                                        </select>
                                        {errors.type && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>
                                </section>

                                {/* Settings */}
                                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <Label htmlFor="time_limit">
                                            Time Limit (minutes)
                                        </Label>
                                        <Input
                                            id="time_limit"
                                            type="number"
                                            min="0"
                                            placeholder="Leave blank for no limit"
                                            value={numberOrNull(
                                                data.time_limit
                                            )}
                                            onChange={(e) =>
                                                setData(
                                                    "time_limit",
                                                    e.target.value === ""
                                                        ? ""
                                                        : Number(e.target.value)
                                                )
                                            }
                                        />
                                        {errors.time_limit && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.time_limit}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="passing_score">
                                            Passing Score (%)
                                        </Label>
                                        <Input
                                            id="passing_score"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={data.passing_score}
                                            onChange={(e) =>
                                                setData(
                                                    "passing_score",
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                        {errors.passing_score && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.passing_score}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="max_attempts">
                                            Max Attempts
                                        </Label>
                                        <Input
                                            id="max_attempts"
                                            type="number"
                                            min="1"
                                            placeholder="Leave blank for unlimited"
                                            value={numberOrNull(
                                                data.max_attempts
                                            )}
                                            onChange={(e) =>
                                                setData(
                                                    "max_attempts",
                                                    e.target.value === ""
                                                        ? ""
                                                        : Number(e.target.value)
                                                )
                                            }
                                        />
                                        {errors.max_attempts && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.max_attempts}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="points_per_question">
                                            Points per Question
                                        </Label>
                                        <Input
                                            id="points_per_question"
                                            type="number"
                                            min="1"
                                            value={data.points_per_question}
                                            onChange={(e) =>
                                                setData(
                                                    "points_per_question",
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                        {errors.points_per_question && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.points_per_question}
                                            </p>
                                        )}
                                    </div>
                                </section>

                                {/* Options */}
                                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={!!data.is_active}
                                            onCheckedChange={(v) =>
                                                setData("is_active", Boolean(v))
                                            }
                                        />
                                        <Label htmlFor="is_active">
                                            Active
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="shuffle_questions"
                                            checked={!!data.shuffle_questions}
                                            onCheckedChange={(v) =>
                                                setData(
                                                    "shuffle_questions",
                                                    Boolean(v)
                                                )
                                            }
                                        />
                                        <Label htmlFor="shuffle_questions">
                                            Shuffle questions
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="show_correct_answers"
                                            checked={
                                                !!data.show_correct_answers
                                            }
                                            onCheckedChange={(v) =>
                                                setData(
                                                    "show_correct_answers",
                                                    Boolean(v)
                                                )
                                            }
                                        />
                                        <Label htmlFor="show_correct_answers">
                                            Show correct answers
                                        </Label>
                                    </div>
                                </section>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? "Saving..."
                                            : "Create Quiz"}
                                    </Button>
                                    <Link href={route("admin.quizzes.index")}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
