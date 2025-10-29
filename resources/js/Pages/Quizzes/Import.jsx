import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function Import({ categories, auth }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        csv_file: null,
        default_category_id: "",
    });

    const [fileName, setFileName] = useState("");
    const [importErrors, setImportErrors] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("csv_file", file);
            setFileName(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("quizzes.import"), {
            onSuccess: (response) => {
                if (response.props.import_errors) {
                    setImportErrors(response.props.import_errors);
                }
            },
            onError: (errors) => {
                if (errors.import_errors) {
                    setImportErrors(errors.import_errors);
                }
            },
        });
    };

    const downloadTemplate = () => {
        window.location.href = route("quizzes.template");
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Import Quizzes" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Import Quizzes from CSV</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Instructions */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-900 mb-2">
                                        How to import quizzes:
                                    </h3>
                                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                                        <li>Download the CSV template</li>
                                        <li>
                                            Fill in your quiz data following the
                                            template format
                                        </li>
                                        <li>
                                            Select a default category (optional
                                            - can be specified in CSV)
                                        </li>
                                        <li>Upload your CSV file</li>
                                        <li>
                                            Click "Import Quizzes" to process
                                            the file
                                        </li>
                                    </ol>
                                </div>

                                {/* Template Download */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-2">
                                        Step 1: Download Template
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Download our CSV template to see the
                                        required format and example data.
                                    </p>
                                    <Button
                                        onClick={downloadTemplate}
                                        variant="outline"
                                    >
                                        Download CSV Template
                                    </Button>
                                </div>

                                {/* CSV Column Information */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-2">
                                        CSV Column Format
                                    </h3>
                                    <div className="text-sm space-y-1">
                                        <p>
                                            <strong>Required columns:</strong>
                                        </p>
                                        <ul className="list-disc list-inside ml-2 text-gray-600">
                                            <li>
                                                <strong>title</strong> - Quiz
                                                title
                                            </li>
                                            <li>
                                                <strong>description</strong> -
                                                Quiz description
                                            </li>
                                            <li>
                                                <strong>category</strong> -
                                                Category name (must exist in
                                                system)
                                            </li>
                                            <li>
                                                <strong>type</strong> - Either
                                                "free" or "premium"
                                            </li>
                                            <li>
                                                <strong>time_limit</strong> -
                                                Time in minutes (empty for no
                                                limit)
                                            </li>
                                            <li>
                                                <strong>passing_score</strong> -
                                                Percentage (1-100)
                                            </li>
                                        </ul>
                                        <p className="mt-2">
                                            <strong>Optional columns:</strong>
                                        </p>
                                        <ul className="list-disc list-inside ml-2 text-gray-600">
                                            <li>
                                                <strong>max_attempts</strong> -
                                                Maximum attempts (empty for
                                                unlimited)
                                            </li>
                                            <li>
                                                <strong>is_active</strong> -
                                                true/false (default: true)
                                            </li>
                                            <li>
                                                <strong>
                                                    shuffle_questions
                                                </strong>{" "}
                                                - true/false (default: false)
                                            </li>
                                            <li>
                                                <strong>
                                                    show_correct_answers
                                                </strong>{" "}
                                                - true/false (default: true)
                                            </li>
                                            <li>
                                                <strong>
                                                    points_per_question
                                                </strong>{" "}
                                                - Points per question (default:
                                                1)
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Import Form */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold mb-4">
                                            Step 2: Upload CSV File
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="default_category">
                                                    Default Category (Optional)
                                                </Label>
                                                <select
                                                    id="default_category"
                                                    value={
                                                        data.default_category_id
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "default_category_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">
                                                        No default (use CSV
                                                        values)
                                                    </option>
                                                    {categories.map(
                                                        (category) => (
                                                            <option
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id
                                                                }
                                                            >
                                                                {category.name}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    If a quiz in the CSV doesn't
                                                    have a category or the
                                                    category doesn't exist, this
                                                    category will be used.
                                                </p>
                                            </div>

                                            <div>
                                                <Label htmlFor="csv_file">
                                                    CSV File *
                                                </Label>
                                                <div className="mt-1">
                                                    <Input
                                                        id="csv_file"
                                                        type="file"
                                                        accept=".csv,.txt"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        className={
                                                            errors.csv_file
                                                                ? "border-red-500"
                                                                : ""
                                                        }
                                                        required
                                                    />
                                                    {fileName && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Selected: {fileName}
                                                        </p>
                                                    )}
                                                    {errors.csv_file && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.csv_file}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upload Progress */}
                                    {progress && (
                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${progress.percentage}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {progress.percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Import Errors */}
                                    {importErrors.length > 0 && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h3 className="font-semibold text-red-900 mb-2">
                                                Import Errors:
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                                                {importErrors.map(
                                                    (error, index) => (
                                                        <li key={index}>
                                                            {error}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Form Actions */}
                                    <div className="flex justify-end gap-4 pt-4">
                                        <Link href={route("quizzes.index")}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                            >
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing || !fileName}
                                        >
                                            {processing
                                                ? "Importing..."
                                                : "Import Quizzes"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
