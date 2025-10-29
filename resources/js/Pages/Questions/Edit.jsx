import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export default function Edit({ quiz, question, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_option: question.correct_option,
        is_active: question.is_active,
        order: question.order || 0,
        question_image: null, // For new image uploads
        remove_image: false, // To track if image should be removed
    });

    const [imagePreview, setImagePreview] = useState(
        question.image_path ? `/storage/${question.image_path}` : null
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.quizzes.questions.update", [quiz.id, question.id]), {
            preserveScroll: true,
            onSuccess: () => {
                // Reset file input
                if (document.getElementById("question_image")) {
                    document.getElementById("question_image").value = "";
                }
            },
        });
    };

    // Handle image selection with preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("question_image", file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                // Reset remove image flag if a new image is selected
                setData("remove_image", false);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle image removal
    const handleRemoveImage = () => {
        setData("question_image", null);
        setData("remove_image", true);
        setImagePreview(null);
        if (document.getElementById("question_image")) {
            document.getElementById("question_image").value = "";
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Question" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Edit Question</CardTitle>
                            </div>
                            <Link
                                href={route(
                                    "admin.quizzes.questions.index",
                                    quiz.id
                                )}
                            >
                                <Button variant="outline">
                                    Back to Questions
                                </Button>
                            </Link>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Question Text */}
                                <div className="space-y-2">
                                    <Label htmlFor="question_text">
                                        Question Text
                                    </Label>
                                    <Textarea
                                        id="question_text"
                                        value={data.question_text}
                                        onChange={(e) =>
                                            setData(
                                                "question_text",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {errors.question_text && (
                                        <p className="text-sm text-red-500">
                                            {errors.question_text}
                                        </p>
                                    )}
                                </div>

                                {/* Question Image Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="question_image">
                                        Question Image (Optional)
                                    </Label>
                                    <Input
                                        id="question_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {errors.question_image && (
                                        <p className="text-sm text-red-500">
                                            {errors.question_image}
                                        </p>
                                    )}

                                    {/* Current Image Preview */}
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-500 mb-1">
                                                    Current image:
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={handleRemoveImage}
                                                    className="h-7 px-2"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />{" "}
                                                    Remove
                                                </Button>
                                            </div>
                                            <img
                                                src={imagePreview}
                                                alt="Question Preview"
                                                className="max-w-xs max-h-48 object-contain border rounded"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Answer Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="option_a">
                                            Option A
                                        </Label>
                                        <Input
                                            id="option_a"
                                            value={data.option_a}
                                            onChange={(e) =>
                                                setData(
                                                    "option_a",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {errors.option_a && (
                                            <p className="text-sm text-red-500">
                                                {errors.option_a}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="option_b">
                                            Option B
                                        </Label>
                                        <Input
                                            id="option_b"
                                            value={data.option_b}
                                            onChange={(e) =>
                                                setData(
                                                    "option_b",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {errors.option_b && (
                                            <p className="text-sm text-red-500">
                                                {errors.option_b}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="option_c">
                                            Option C
                                        </Label>
                                        <Input
                                            id="option_c"
                                            value={data.option_c}
                                            onChange={(e) =>
                                                setData(
                                                    "option_c",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {errors.option_c && (
                                            <p className="text-sm text-red-500">
                                                {errors.option_c}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="option_d">
                                            Option D
                                        </Label>
                                        <Input
                                            id="option_d"
                                            value={data.option_d}
                                            onChange={(e) =>
                                                setData(
                                                    "option_d",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {errors.option_d && (
                                            <p className="text-sm text-red-500">
                                                {errors.option_d}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Correct Option */}
                                <div className="space-y-2">
                                    <Label htmlFor="correct_option">
                                        Correct Option
                                    </Label>
                                    <Select
                                        value={data.correct_option}
                                        onValueChange={(value) =>
                                            setData("correct_option", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select correct option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">
                                                Option A
                                            </SelectItem>
                                            <SelectItem value="B">
                                                Option B
                                            </SelectItem>
                                            <SelectItem value="C">
                                                Option C
                                            </SelectItem>
                                            <SelectItem value="D">
                                                Option D
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.correct_option && (
                                        <p className="text-sm text-red-500">
                                            {errors.correct_option}
                                        </p>
                                    )}
                                </div>

                                {/* Order */}
                                <div className="space-y-2">
                                    <Label htmlFor="order">
                                        Order (Optional)
                                    </Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={(e) =>
                                            setData("order", e.target.value)
                                        }
                                    />
                                    {errors.order && (
                                        <p className="text-sm text-red-500">
                                            {errors.order}
                                        </p>
                                    )}
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(value) =>
                                            setData("is_active", value)
                                        }
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                    {errors.is_active && (
                                        <p className="text-sm text-red-500">
                                            {errors.is_active}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        Update Question
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
