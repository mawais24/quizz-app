import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import React, { useState } from "react";
import {
    Menu,
    X,
    ChevronDown,
    User,
    LogOut,
    LogIn,
    Home,
    BookOpen,
    CreditCard,
    Award,
    HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GuestLayout({ children, auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo & Brand */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center">
                                <svg
                                    className="h-8 w-8 text-blue-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                                    <path d="m9 12 2 2 4-4"></path>
                                </svg>
                                <span className="text-xl font-bold text-gray-900 ml-2">
                                    QuizApp
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1 lg:ml-10">
                            <div className="flex space-x-4">
                                <Link
                                    href="/"
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                >
                                    <Home className="w-4 h-4 mr-1" />
                                    Home
                                </Link>
                                <Link
                                    href={route("public.quizzes")}
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                >
                                    <BookOpen className="w-4 h-4 mr-1" />
                                    Quizzes
                                </Link>
                                <Link
                                    href={route("subscription.plans")}
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                >
                                    <CreditCard className="w-4 h-4 mr-1" />
                                    Pricing
                                </Link>
                                <a
                                    href="#faq"
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                >
                                    <HelpCircle className="w-4 h-4 mr-1" />
                                    FAQ
                                </a>
                            </div>

                            <div className="flex items-center">
                                {auth.user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2"
                                            >
                                                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium">
                                                        {auth.user.name
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            "U"}
                                                    </span>
                                                </span>
                                                <span>{auth.user.name}</span>
                                                <ChevronDown className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-56"
                                        >
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={route("dashboard")}
                                                    className="flex items-center"
                                                >
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={route(
                                                        "user.quiz-history"
                                                    )}
                                                    className="flex items-center"
                                                >
                                                    <Award className="mr-2 h-4 w-4" />
                                                    <span>My Quiz History</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={route(
                                                        "user.subscription"
                                                    )}
                                                    className="flex items-center"
                                                >
                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                    <span>My Subscription</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="flex w-full items-center"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    <span>Logout</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <div className="flex space-x-3">
                                        <Link href={route("login")}>
                                            <Button
                                                variant="outline"
                                                className="flex items-center"
                                            >
                                                <LogIn className="w-4 h-4 mr-2" />
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href={route("register")}>
                                            <Button className="flex items-center">
                                                <User className="w-4 h-4 mr-2" />
                                                Register
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex lg:hidden">
                            <button
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                {mobileMenuOpen ? (
                                    <X
                                        className="block h-6 w-6"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <Menu
                                        className="block h-6 w-6"
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-b border-gray-200">
                        <div className="container mx-auto px-4 pt-2 pb-3 space-y-1">
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href={route("public.quizzes")}
                                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Quizzes
                            </Link>
                            <Link
                                href={route("subscription.plans")}
                                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            <a
                                href="#faq"
                                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                FAQ
                            </a>

                            <div className="border-t border-gray-200 pt-4 pb-3">
                                {auth.user ? (
                                    <>
                                        <div className="flex items-center px-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium">
                                                        {auth.user.name
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            "U"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-base font-medium text-gray-800">
                                                    {auth.user.name}
                                                </div>
                                                <div className="text-sm font-medium text-gray-500">
                                                    {auth.user.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 space-y-1">
                                            <Link
                                                href={route("dashboard")}
                                                className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                href={route(
                                                    "user.quiz-history"
                                                )}
                                                className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                My Quiz History
                                            </Link>
                                            <Link
                                                href={route(
                                                    "user.subscription"
                                                )}
                                                className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                My Subscription
                                            </Link>
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="w-full text-left block px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-3 space-y-1 px-2">
                                        <Link
                                            href={route("login")}
                                            className="flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="flex justify-center w-full px-4 py-2 text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md mt-2"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Page Content */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4">QuizApp</h3>
                            <p className="text-gray-400 mb-4">
                                Challenge yourself with interactive quizzes
                                across various topics and subjects.
                            </p>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"></path>
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"></path>
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">
                                Navigation
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("public.quizzes")}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Browse Quizzes
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("subscription.plans")}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        Pricing Plans
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#faq"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Account</h3>
                            <ul className="space-y-2">
                                {auth.user ? (
                                    <>
                                        <li>
                                            <Link
                                                href={route("dashboard")}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route(
                                                    "user.quiz-history"
                                                )}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                My Quiz History
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route(
                                                    "user.subscription"
                                                )}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                My Subscription
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="text-gray-400 hover:text-white"
                                            >
                                                Logout
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link
                                                href={route("login")}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                Login
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route("register")}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                Register
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">
                                Contact Us
                            </h3>
                            <ul className="space-y-2 text-gray-400">
                                <li className="flex items-start">
                                    <svg
                                        className="h-5 w-5 mr-2 mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>support@quizapp.com</span>
                                </li>
                                <li className="flex items-start">
                                    <svg
                                        className="h-5 w-5 mr-2 mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    <span>+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-start">
                                    <svg
                                        className="h-5 w-5 mr-2 mt-0.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <span>
                                        123 Quiz Street, Knowledge City, QZ
                                        12345
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} QuizApp. All
                            rights reserved.
                        </div>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white text-sm"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white text-sm"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white text-sm"
                            >
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
