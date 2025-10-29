import { Head, Link } from "@inertiajs/react";
import { ArrowRight, BookOpen, Award, Users, Clock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/Layouts/GuestLayout";

export default function Welcome({
    auth,
    featuredQuizzes,
    categories,
    testimonials,
}) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };
    return (
        <MainLayout auth={auth}>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 lg:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-full bg-[url('/images/pattern-bg.svg')] opacity-10"></div>
                </div>
                <div className="container mx-auto px-4 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Test Your Knowledge With Interactive Quizzes
                            </h1>
                            <p className="text-xl opacity-90 mb-8 max-w-lg">
                                Challenge yourself, learn new things, and track
                                your progress with our engaging quiz platform.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href={route("public.quizzes")}>
                                    <Button
                                        size="lg"
                                        className="bg-white text-blue-700 hover:bg-gray-100"
                                    >
                                        Browse Quizzes{" "}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                                {!auth.user && (
                                    <Link href={route("register")}>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="border-white text-white hover:bg-blue-600"
                                        >
                                            Sign Up Free
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <img
                                src="/images/hero-quiz.svg"
                                alt="Quiz illustration"
                                className="w-full max-w-lg mx-auto"
                                onError={(e) => {
                                    e.target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzMwNDJlNiIgLz4KICA8dGV4dCB4PSIyNTAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwcHgiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPktub3dsZWRnZSBRdWl6IFBsYXRmb3JtPC90ZXh0Pgo8L3N2Zz4=";
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Our Quiz Platform?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We've designed our platform to be engaging,
                            educational, and accessible for everyone.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Diverse Quiz Collection
                            </h3>
                            <p className="text-gray-600">
                                Explore quizzes across various categories from
                                general knowledge to specialized subjects.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                                <Award className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Track Your Progress
                            </h3>
                            <p className="text-gray-600">
                                See your scores, analyze your answers, and watch
                                as your knowledge improves over time.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Community Learning
                            </h3>
                            <p className="text-gray-600">
                                Join thousands of learners expanding their
                                knowledge through interactive quizzes.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Timed Challenges
                            </h3>
                            <p className="text-gray-600">
                                Test your knowledge under pressure with timed
                                quizzes that keep you engaged.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                                <Brain className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Educational Focus
                            </h3>
                            <p className="text-gray-600">
                                Learn as you go with detailed explanations and
                                resources for each question.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Premium Content
                            </h3>
                            <p className="text-gray-600">
                                Access exclusive quizzes and advanced features
                                with our affordable subscription plans.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Quizzes */}
            {featuredQuizzes && featuredQuizzes.length > 0 && (
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Featured Quizzes
                                </h2>
                                <p className="text-xl text-gray-600">
                                    Start with some of our most popular
                                    challenges
                                </p>
                            </div>
                            <Link href={route("public.quizzes")}>
                                <Button variant="outline">
                                    View All Quizzes{" "}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredQuizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md"
                                >
                                    {quiz.image_path ? (
                                        <img
                                            src={`/storage/${quiz.image_path}`}
                                            alt={quiz.title}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.src =
                                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIgLz4KICA8dGV4dCB4PSIyMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2cHgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlF1aXogSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-blue-500" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        {quiz.category && (
                                            <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full mb-3 inline-block">
                                                {quiz.category.name}
                                            </span>
                                        )}
                                        <h3 className="text-xl font-bold mb-2">
                                            {quiz.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {quiz.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 text-gray-500 mr-1" />
                                                <span className="text-sm text-gray-500">
                                                    {quiz.time_limit
                                                        ? `${quiz.time_limit} min`
                                                        : "No time limit"}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <BookOpen className="w-4 h-4 text-gray-500 mr-1" />
                                                <span className="text-sm text-gray-500">
                                                    {quiz.total_questions || 0}{" "}
                                                    questions
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            href={route(
                                                "public.quiz.show",
                                                quiz.id
                                            )}
                                            className="mt-4 inline-block w-full"
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Start Quiz
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories Section */}
            {categories && categories.length > 0 && (
                <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Quiz Categories
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Explore quizzes in your favorite topics or
                                discover new interests
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={
                                        route("public.quizzes") +
                                        `?category=${category.id}`
                                    }
                                    className="block group"
                                >
                                    <div className="bg-white rounded-lg p-8 text-center border border-gray-200 transition-all duration-300 hover:border-blue-500 hover:shadow-sm">
                                        <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-blue-600">
                                            {category.name}
                                        </h3>
                                        {category.quiz_count && (
                                            <p className="text-gray-500">
                                                {category.quiz_count} quizzes
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing CTA */}
            <section className="py-20 bg-indigo-700 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Unlock Premium Quizzes and Features
                        </h2>
                        <p className="text-xl opacity-90 mb-8">
                            Get unlimited access to all premium content, save
                            your progress, and enjoy an ad-free experience.
                        </p>
                        <Link href={route("subscription.plans")}>
                            <Button
                                size="lg"
                                className="bg-white text-indigo-700 hover:bg-gray-100"
                            >
                                View Pricing Plans
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {testimonials && testimonials.length > 0 && (
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                What Our Users Say
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Join thousands of satisfied learners using our
                                platform
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-lg shadow-sm border border-gray-200"
                                >
                                    <div className="flex items-center mb-4">
                                        <svg
                                            className="text-yellow-500 w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg
                                            className="text-yellow-500 w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg
                                            className="text-yellow-500 w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg
                                            className="text-yellow-500 w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg
                                            className="text-yellow-500 w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 mb-4 italic">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="font-bold text-gray-600">
                                                {testimonial.name?.charAt(0) ||
                                                    "U"}
                                            </span>
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-sm font-bold">
                                                {testimonial.name}
                                            </h4>
                                            {testimonial.role && (
                                                <p className="text-xs text-gray-500">
                                                    {testimonial.role}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ready to Test Your Knowledge?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Join our community of learners and challenge yourself
                        today.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href={route("public.quizzes")}>
                            <Button size="lg">
                                Browse Quizzes{" "}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                        {!auth.user && (
                            <Link href={route("register")}>
                                <Button size="lg" variant="outline">
                                    Create an Account
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
