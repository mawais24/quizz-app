import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";

export default function Index({ quizzes, categories, filters = {}, auth }) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || "");
    const [categoryId, setCategoryId] = useState(filters.category_id || "");
    const [type, setType] = useState(filters.type || "");
    const [status, setStatus] = useState(filters.status || "");

    // Build query params from local state
    const query = useMemo(
        () => ({
            search: search || undefined,
            category_id: categoryId || undefined,
            type: type || undefined,
            status: status || undefined,
        }),
        [search, categoryId, type, status]
    );

    const applyFilters = (e) => {
        e && e.preventDefault();
        router.get(route("admin.quizzes.index"), query, {
            preserveState: true,
            replace: true,
        });
    };

    // Submit on enter in search
    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") applyFilters(e);
    };

    const clearFilters = () => {
        setSearch("");
        setCategoryId("");
        setType("");
        setStatus("");
        router.get(route("quizzes.index"), {}, { replace: true });
    };

    const onDelete = (id) => {
        if (
            confirm(
                "Are you sure you want to delete this quiz? This cannot be undone."
            )
        ) {
            router.delete(route("quizzes.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    const Pagination = ({ links = [] }) => {
        if (!links.length) return null;
        return (
            <div className="flex flex-wrap items-center gap-2">
                {links.map((link, idx) => {
                    if (!link.url) {
                        return (
                            <span
                                key={idx}
                                className="px-3 py-1 text-sm rounded border border-gray-200 text-gray-400"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }
                    return (
                        <Link
                            key={idx}
                            href={link.url}
                            preserveScroll
                            className={`px-3 py-1 text-sm rounded border ${
                                link.active
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "border-gray-200 hover:bg-gray-50"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Quizzes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle className="text-2xl">Quizzes</CardTitle>
                            <div className="flex gap-2">
                                {/* Import page (GET) — adjust the route name if your GET is different */}
                                <Link
                                    href={route(
                                        "admin.quizzes.import.form",
                                        {}
                                    )}
                                >
                                    <Button variant="outline">
                                        Import CSV
                                    </Button>
                                </Link>
                                <Link href={route("admin.quizzes.create")}>
                                    <Button>Create New Quiz</Button>
                                </Link>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Filters */}
                            <form
                                onSubmit={applyFilters}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4"
                            >
                                <div className="md:col-span-4">
                                    <Label htmlFor="search">Search</Label>
                                    <Input
                                        id="search"
                                        placeholder="Search by title or description..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyDown={handleSearchKeyDown}
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <Label htmlFor="category_id">
                                        Category
                                    </Label>
                                    <select
                                        id="category_id"
                                        value={categoryId}
                                        onChange={(e) =>
                                            setCategoryId(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All categories</option>
                                        {categories?.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        id="type"
                                        value={type}
                                        onChange={(e) =>
                                            setType(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All</option>
                                        <option value="free">Free</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                                <div className="md:col-span-1 flex items-end gap-2">
                                    <Button type="submit" className="w-full">
                                        Filter
                                    </Button>
                                </div>
                                <div className="md:col-span-12">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearFilters}
                                    >
                                        Clear filters
                                    </Button>
                                </div>
                            </form>

                            {/* Table */}
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Active
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Questions
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Passing
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Time
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Updated
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {quizzes?.data?.length ? (
                                            quizzes.data.map((q) => (
                                                <tr
                                                    key={q.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-gray-900">
                                                            {q.title}
                                                        </div>
                                                        {q.description && (
                                                            <div className="text-xs text-gray-500 line-clamp-1">
                                                                {q.description}
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {q.category?.name ??
                                                            "—"}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <Badge
                                                            variant={
                                                                q.type ===
                                                                "premium"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {q.type}
                                                        </Badge>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <Badge
                                                            variant={
                                                                q.is_active
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {q.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </Badge>
                                                    </td>

                                                    <td className="px-4 py-3 text-right text-sm">
                                                        {q.total_questions ?? 0}
                                                    </td>

                                                    <td className="px-4 py-3 text-right text-sm">
                                                        {q.passing_score}%
                                                    </td>

                                                    <td className="px-4 py-3 text-right text-sm">
                                                        {q.time_limit
                                                            ? `${q.time_limit} min`
                                                            : "—"}
                                                    </td>

                                                    <td className="px-4 py-3 text-right text-sm">
                                                        {q.updated_at
                                                            ? new Date(
                                                                  q.updated_at
                                                              ).toLocaleDateString()
                                                            : "—"}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-end flex-wrap gap-2">
                                                            {/* 🔹 New buttons for MCQs */}
                                                            <Link
                                                                href={route(
                                                                    "admin.quizzes.questions.index",
                                                                    q.id
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    Manage
                                                                    Questions
                                                                </Button>
                                                            </Link>

                                                            <Link
                                                                href={route(
                                                                    "admin.quizzes.questions.create",
                                                                    q.id
                                                                )}
                                                            >
                                                                <Button size="sm">
                                                                    Add Question
                                                                </Button>
                                                            </Link>

                                                            {/* Existing buttons */}
                                                            <Link
                                                                href={route(
                                                                    "admin.quizzes.show",
                                                                    q.id
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    View
                                                                </Button>
                                                            </Link>

                                                            <Link
                                                                href={route(
                                                                    "admin.quizzes.edit",
                                                                    q.id
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </Link>

                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() =>
                                                                    onDelete(
                                                                        q.id
                                                                    )
                                                                }
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
                                                    colSpan="9"
                                                    className="px-4 py-10 text-center text-gray-500"
                                                >
                                                    No quizzes found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer: pagination */}
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    {quizzes?.from &&
                                    quizzes?.to &&
                                    quizzes?.total
                                        ? `Showing ${quizzes.from}-${quizzes.to} of ${quizzes.total}`
                                        : null}
                                </div>
                                <Pagination links={quizzes?.links || []} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
