import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Lock, Clock, Trophy, Target, Users } from "lucide-react";
import MainLayout from "@/Layouts/GuestLayout";

export default function QuizIndex({
    quizzes,
    categories,
    filters,
    hasActiveSubscription,
    user,
    auth,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [categoryFilter, setCategoryFilter] = useState(
        filters.category_id || ""
    );
    const [typeFilter, setTypeFilter] = useState(filters.type || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("public.quizzes"),
            {
                search: search,
                category_id: categoryFilter,
                type: typeFilter,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setCategoryFilter("");
        setTypeFilter("");
        router.get(route("public.quizzes"));
    };

    return (
        <MainLayout auth={auth}>
            <Head title="Available Quizzes" />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Test Your Knowledge
                        </h1>
                        <p className="text-xl md:text-2xl opacity-90">
                            Explore our collection of quizzes across various
                            topics
                        </p>
                        {!user && (
                            <div className="mt-6">
                                <Link href={route("register")}>
                                    <Button size="lg" variant="secondary">
                                        Sign Up to Track Progress
                                    </Button>
                                </Link>
                            </div>
                        )}
                        {user && !hasActiveSubscription && (
                            <div className="mt-6">
                                <Link href={route("subscription.plans")}>
                                    <Button size="lg" variant="secondary">
                                        Unlock Premium Quizzes
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <form onSubmit={handleSearch}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Input
                                    type="text"
                                    placeholder="Search quizzes..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={categoryFilter}
                                    onChange={(e) =>
                                        setCategoryFilter(e.target.value)
                                    }
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name} (
                                            {category.quizzes_count})
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={typeFilter}
                                    onChange={(e) =>
                                        setTypeFilter(e.target.value)
                                    }
                                >
                                    <option value="">All Types</option>
                                    <option value="free">Free Quizzes</option>
                                    <option value="premium">
                                        Premium Quizzes
                                    </option>
                                </select>
                                <div className="flex gap-2">
                                    <Button type="submit">Filter</Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearFilters}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Quiz Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.data.map((quiz) => (
                            <Card
                                key={quiz.id}
                                className={quiz.is_locked ? "opacity-90" : ""}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">
                                            {quiz.title}
                                        </CardTitle>
                                        <div className="flex gap-1">
                                            {quiz.type === "premium" ? (
                                                <Badge
                                                    variant="default"
                                                    className="bg-gradient-to-r from-yellow-500 to-orange-500"
                                                >
                                                    {quiz.is_locked ? (
                                                        <Lock className="w-3 h-3 mr-1" />
                                                    ) : null}
                                                    Premium
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Free
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {quiz.category.name}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {quiz.description ||
                                            "No description available"}
                                    </p>

                                    {/* Quiz Stats */}
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {quiz.time_limit
                                                ? `${quiz.time_limit} min`
                                                : "No limit"}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Target className="w-4 h-4" />
                                            Pass: {quiz.passing_score}%
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {quiz.total_questions} questions
                                        </div>
                                        {quiz.best_score !== undefined &&
                                            quiz.best_score !== null && (
                                                <div className="flex items-center gap-1">
                                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                                    Best: {quiz.best_score}%
                                                </div>
                                            )}
                                    </div>

                                    {/* User Progress */}
                                    {user && quiz.last_attempt && (
                                        <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">
                                                    Last attempt:
                                                </span>
                                                <Badge
                                                    variant={
                                                        quiz.last_attempt.passed
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {quiz.last_attempt.score
                                                        ? `${quiz.last_attempt.score}%`
                                                        : "In Progress"}
                                                </Badge>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    {quiz.is_locked ? (
                                        <Link
                                            href={route("subscription.plans")}
                                            className="block"
                                        >
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                            >
                                                <Lock className="w-4 h-4 mr-2" />
                                                Unlock with Premium
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route(
                                                "public.quiz.show",
                                                quiz.id
                                            )}
                                            className="block"
                                        >
                                            <Button className="w-full">
                                                {quiz.last_attempt &&
                                                quiz.last_attempt.status ===
                                                    "in_progress"
                                                    ? "Continue Quiz"
                                                    : quiz.attempts_count > 0
                                                    ? "Retake Quiz"
                                                    : "Start Quiz"}
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {quizzes.data.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500 text-lg">
                                No quizzes found matching your criteria.
                            </p>
                            <Button onClick={clearFilters} className="mt-4">
                                Clear Filters
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {quizzes.last_page > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {quizzes.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || "#"}
                                    className={`px-4 py-2 rounded ${
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
                </div>
            </div>
        </MainLayout>
    );
}
