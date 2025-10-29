import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Edit({ quiz, categories, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        title: quiz.title || "",
        description: quiz.description || "",
        category_id: quiz.category_id || "",
        type: quiz.type || "free",
        time_limit: quiz.time_limit || "",
        passing_score: quiz.passing_score || 60,
        max_attempts: quiz.max_attempts || "",
        is_active: quiz.is_active || false,
        shuffle_questions: quiz.shuffle_questions || false,
        show_correct_answers: quiz.show_correct_answers || true,
        points_per_question: quiz.points_per_question || 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("quizzes.update", quiz.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Quiz" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Quiz</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Basic Information
                                    </h3>

                                    <div>
                                        <Label htmlFor="title">
                                            Quiz Title *
                                        </Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            className={
                                                errors.title
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                            required
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            placeholder="Describe what this quiz is about..."
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="category_id">
                                                Category *
                                            </Label>
                                            <select
                                                id="category_id"
                                                value={data.category_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "category_id",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    errors.category_id
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                required
                                            >
                                                <option value="">
                                                    Select a category
                                                </option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
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
                                                Quiz Type *
                                            </Label>
                                            <select
                                                id="type"
                                                value={data.type}
                                                onChange={(e) =>
                                                    setData(
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="free">
                                                    Free
                                                </option>
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
                                    </div>
                                </div>

                                {/* Quiz Settings */}
                                <div className="space-y-4 border-t pt-6">
                                    <h3 className="text-lg font-semibold">
                                        Quiz Settings
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="time_limit">
                                                Time Limit (minutes)
                                            </Label>
                                            <Input
                                                id="time_limit"
                                                type="number"
                                                value={data.time_limit}
                                                onChange={(e) =>
                                                    setData(
                                                        "time_limit",
                                                        e.target.value
                                                    )
                                                }
                                                min="1"
                                                max="600"
                                                placeholder="No limit"
                                            />
                                            {errors.time_limit && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.time_limit}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="passing_score">
                                                Passing Score (%) *
                                            </Label>
                                            <Input
                                                id="passing_score"
                                                type="number"
                                                value={data.passing_score}
                                                onChange={(e) =>
                                                    setData(
                                                        "passing_score",
                                                        e.target.value
                                                    )
                                                }
                                                min="1"
                                                max="100"
                                                required
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
                                                value={data.max_attempts}
                                                onChange={(e) =>
                                                    setData(
                                                        "max_attempts",
                                                        e.target.value
                                                    )
                                                }
                                                min="1"
                                                max="100"
                                                placeholder="Unlimited"
                                            />
                                            {errors.max_attempts && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.max_attempts}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="points_per_question">
                                            Points Per Question *
                                        </Label>
                                        <Input
                                            id="points_per_question"
                                            type="number"
                                            value={data.points_per_question}
                                            onChange={(e) =>
                                                setData(
                                                    "points_per_question",
                                                    e.target.value
                                                )
                                            }
                                            min="1"
                                            max="100"
                                            required
                                        />
                                        {errors.points_per_question && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.points_per_question}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="space-y-4 border-t pt-6">
                                    <h3 className="text-lg font-semibold">
                                        Options
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) =>
                                                    setData(
                                                        "is_active",
                                                        checked
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="is_active"
                                                className="cursor-pointer"
                                            >
                                                Quiz is active and visible to
                                                users
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="shuffle_questions"
                                                checked={data.shuffle_questions}
                                                onCheckedChange={(checked) =>
                                                    setData(
                                                        "shuffle_questions",
                                                        checked
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="shuffle_questions"
                                                className="cursor-pointer"
                                            >
                                                Shuffle questions for each
                                                attempt
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="show_correct_answers"
                                                checked={
                                                    data.show_correct_answers
                                                }
                                                onCheckedChange={(checked) =>
                                                    setData(
                                                        "show_correct_answers",
                                                        checked
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="show_correct_answers"
                                                className="cursor-pointer"
                                            >
                                                Show correct answers after quiz
                                                completion
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-4 pt-6 border-t">
                                    <Link href={route("quizzes.index")}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? "Updating..."
                                            : "Update Quiz"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
