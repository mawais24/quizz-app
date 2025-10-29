import { useState, useEffect, useRef } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Bookmark,
    Flag,
    ArrowLeft,
    ArrowRight,
    Clock,
    CheckCircle,
    XCircle,
    Maximize2,
    Eraser,
    PenTool,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function TakeQuiz({
    quiz,
    attempt,
    questions,
    answers,
    timeRemaining,
}) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [flaggedQuestions, setFlaggedQuestions] = useState({});
    const [timeLeft, setTimeLeft] = useState(timeRemaining || null);
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    const [savingAnswer, setSavingAnswer] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingTool, setDrawingTool] = useState("pen"); // 'pen' or 'eraser'
    const [penColor, setPenColor] = useState("#000000");
    const [penSize, setPenSize] = useState(2);
    // Add a feedback state to show success/error messages
    const [feedback, setFeedback] = useState(null);
    // Add a ref to the sheet close button
    const sheetCloseRef = useRef(null);
    // Add toggle flag loading state
    const [togglingFlag, setTogglingFlag] = useState(false);

    // Initialize selected answers and flagged questions from existing data
    useEffect(() => {
        const answerMap = {};
        const flagMap = {};

        if (answers && answers.length) {
            answers.forEach((answer) => {
                answerMap[answer.question_id] = answer.selected_option;
                if (answer.is_flagged) {
                    flagMap[answer.question_id] = true;
                }
            });
        }

        setSelectedAnswers(answerMap);
        setFlaggedQuestions(flagMap);
    }, [answers]);

    // Timer countdown effect
    useEffect(() => {
        if (!timeLeft || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Auto-submit when time runs out
                    submitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Initialize canvas after component mounts
    useEffect(() => {
        if (isCanvasOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const context = canvas.getContext("2d");
            context.lineCap = "round";
            context.strokeStyle = penColor;
            context.lineWidth = penSize;
            contextRef.current = context;
        }
    }, [isCanvasOpen, penColor, penSize]);

    // Clear feedback after 3 seconds
    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => {
                setFeedback(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    const formatTime = (seconds) => {
        if (!seconds && seconds !== 0) return "--:--";
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const currentQuestion = questions[currentQuestionIndex];

    // Function to save the answer using AJAX without page refresh
    const saveAnswer = async (questionId, option) => {
        // Update local state immediately for responsiveness
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));

        // Set saving state
        setSavingAnswer(true);

        try {
            // Use axios instead of Inertia form to prevent page refresh
            const response = await axios.post(
                route("quiz.submit-answer", {
                    quiz: quiz.id,
                    attempt: attempt.id,
                }),
                {
                    question_id: questionId,
                    answer: option,
                },
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );

            // Handle success
            console.log("Answer saved:", response.data);

            // Set success feedback
            setFeedback({ type: "success", message: "Answer saved" });
        } catch (error) {
            console.error("Error saving answer:", error);

            // Set error feedback
            setFeedback({ type: "error", message: "Failed to save answer" });
        } finally {
            setSavingAnswer(false);
        }
    };

    // Function to toggle flag status with AJAX - FIXED route path
    const toggleFlag = async (questionId) => {
        if (togglingFlag) return; // Prevent multiple clicks

        setTogglingFlag(true);

        // Update local state immediately for responsiveness
        setFlaggedQuestions((prev) => {
            const newFlags = { ...prev };
            if (newFlags[questionId]) {
                delete newFlags[questionId];
            } else {
                newFlags[questionId] = true;
            }
            return newFlags;
        });

        // Here's the exact route path format to match the web.php definition
        const flagUrl = `/quiz-attempt/${attempt.id}/question/${questionId}/toggle-flag`;

        try {
            console.log("Calling flag route:", flagUrl);

            const response = await axios.post(
                flagUrl,
                {},
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );

            console.log("Flag toggled:", response.data);
            setFeedback({ type: "success", message: "Flag toggled" });
        } catch (error) {
            console.error("Error toggling flag:", error);

            // Revert the local state change if the API call fails
            setFlaggedQuestions((prev) => {
                const newFlags = { ...prev };
                if (newFlags[questionId]) {
                    delete newFlags[questionId];
                } else {
                    newFlags[questionId] = true;
                }
                return newFlags;
            });

            setFeedback({ type: "error", message: "Failed to toggle flag" });
        } finally {
            setTogglingFlag(false);
        }
    };

    // Navigation functions
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const goToPrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    // Function to directly navigate to a specific question
    const goToQuestion = (index) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
            // Manually close the sheet
            if (sheetCloseRef.current) {
                sheetCloseRef.current.click();
            }
        }
    };

    // Quiz submission
    const submitQuiz = () => {
        if (
            window.confirm(
                "Are you sure you want to submit your quiz? You cannot return to this attempt after submission."
            )
        ) {
            // Use Inertia router for page navigation after submission
            router.post(
                route("quiz.complete", {
                    quiz: quiz.id,
                    attempt: attempt.id,
                })
            );
        }
    };

    // Canvas drawing functions
    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const clearCanvas = () => {
        if (!canvasRef.current || !contextRef.current) return;
        const canvas = canvasRef.current;
        const context = contextRef.current;
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const setEraser = () => {
        setDrawingTool("eraser");
        if (contextRef.current) {
            contextRef.current.strokeStyle = "#FFFFFF";
            contextRef.current.lineWidth = 15;
        }
    };

    const setPen = () => {
        setDrawingTool("pen");
        if (contextRef.current) {
            contextRef.current.strokeStyle = penColor;
            contextRef.current.lineWidth = penSize;
        }
    };

    const handleColorChange = (color) => {
        setPenColor(color);
        if (drawingTool === "pen" && contextRef.current) {
            contextRef.current.strokeStyle = color;
        }
    };

    const handleSizeChange = (size) => {
        const newSize = parseInt(size);
        setPenSize(newSize);
        if (drawingTool === "pen" && contextRef.current) {
            contextRef.current.lineWidth = newSize;
        }
    };

    // Debug helper for image paths
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        // If path already starts with http or /storage, use it directly
        if (imagePath.startsWith("http") || imagePath.startsWith("/storage")) {
            return imagePath;
        }
        // Otherwise, prepend /storage/
        return `/storage/${imagePath}`;
    };

    return (
        <>
            <Head title={`Taking Quiz: ${quiz.title}`} />

            <div className="min-h-screen bg-gray-50 py-4">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Feedback message */}
                    {feedback && (
                        <div
                            className={`mb-4 p-3 rounded text-white text-sm ${
                                feedback.type === "success"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }`}
                        >
                            {feedback.message}
                        </div>
                    )}

                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-xl font-semibold">{quiz.title}</h1>
                        {timeLeft !== null && (
                            <div className="flex items-center text-sm font-medium">
                                <Clock className="w-4 h-4 mr-1" />
                                Time Remaining: {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <Progress
                            value={
                                ((currentQuestionIndex + 1) /
                                    questions.length) *
                                100
                            }
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>
                                Question {currentQuestionIndex + 1} of{" "}
                                {questions.length}
                            </span>
                            <span>
                                Answered: {Object.keys(selectedAnswers).length}{" "}
                                of {questions.length}
                            </span>
                        </div>
                    </div>

                    {/* Question Card */}
                    <Card className="mb-4">
                        <CardContent className="p-6">
                            {/* Question Header with Flag Button */}
                            <div className="flex justify-between mb-4">
                                <h2 className="text-lg font-semibold">
                                    Question {currentQuestionIndex + 1}
                                </h2>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={
                                                    flaggedQuestions[
                                                        currentQuestion?.id
                                                    ]
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    toggleFlag(
                                                        currentQuestion.id
                                                    )
                                                }
                                                type="button"
                                                disabled={togglingFlag}
                                            >
                                                <Flag
                                                    className={`w-4 h-4 ${
                                                        flaggedQuestions[
                                                            currentQuestion?.id
                                                        ]
                                                            ? "text-white"
                                                            : ""
                                                    }`}
                                                />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {flaggedQuestions[
                                                    currentQuestion?.id
                                                ]
                                                    ? "Unflag"
                                                    : "Flag"}{" "}
                                                this question
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            {/* Question Text */}
                            <div className="mb-4">
                                <p className="text-gray-800">
                                    {currentQuestion?.question_text}
                                </p>
                            </div>

                            {/* Question Image with Canvas Tool */}
                            {currentQuestion?.image_path && (
                                <div className="mb-4 relative">
                                    <img
                                        src={getImageUrl(
                                            currentQuestion.image_path
                                        )}
                                        alt="Question illustration"
                                        className="max-w-full rounded border"
                                        onError={(e) => {
                                            console.error(
                                                "Image load error:",
                                                e
                                            );
                                            e.target.src =
                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIgLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEycHgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==";
                                            e.target.onerror = null; // Prevent infinite loop
                                        }}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => setIsCanvasOpen(true)}
                                        type="button" // Important: specify button type
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                        <span className="ml-1">Draw</span>
                                    </Button>
                                </div>
                            )}

                            {/* Answer Options */}
                            <div className="space-y-3">
                                {/* Use a div instead of a form to prevent automatic submission */}
                                <div>
                                    <RadioGroup
                                        value={
                                            selectedAnswers[
                                                currentQuestion?.id
                                            ] || ""
                                        }
                                        onValueChange={(value) => {
                                            // Prevent default behavior
                                            saveAnswer(
                                                currentQuestion.id,
                                                value
                                            );
                                        }}
                                    >
                                        {["A", "B", "C", "D"].map((option) => (
                                            <div
                                                key={option}
                                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                                            >
                                                <RadioGroupItem
                                                    value={option}
                                                    id={`option-${option}`}
                                                    disabled={savingAnswer}
                                                    checked={
                                                        selectedAnswers[
                                                            currentQuestion?.id
                                                        ] === option
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`option-${option}`}
                                                    className="flex-1"
                                                >
                                                    <span className="font-medium mr-2">
                                                        {option}.
                                                    </span>
                                                    {
                                                        currentQuestion?.[
                                                            `option_${option.toLowerCase()}`
                                                        ]
                                                    }
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation and Actions */}
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={goToPrevQuestion}
                            disabled={currentQuestionIndex === 0}
                            type="button" // Important: specify button type
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                        </Button>

                        <div className="flex space-x-2">
                            {/* Flagged Questions Sidebar */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" type="button">
                                        <Bookmark className="w-4 h-4 mr-2" />
                                        Flagged Questions
                                        {Object.keys(flaggedQuestions).length >
                                            0 && (
                                            <span className="ml-1 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs">
                                                {
                                                    Object.keys(
                                                        flaggedQuestions
                                                    ).length
                                                }
                                            </span>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>
                                            Flagged Questions
                                        </SheetTitle>
                                        <SheetDescription>
                                            Questions you've marked for review
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="py-4">
                                        {Object.keys(flaggedQuestions)
                                            .length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                No flagged questions yet.
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {questions.map(
                                                    (q, index) =>
                                                        flaggedQuestions[
                                                            q.id
                                                        ] && (
                                                            <div key={q.id}>
                                                                <Button
                                                                    variant={
                                                                        currentQuestionIndex ===
                                                                        index
                                                                            ? "default"
                                                                            : "outline"
                                                                    }
                                                                    className="w-full justify-start text-left"
                                                                    onClick={() => {
                                                                        setCurrentQuestionIndex(
                                                                            index
                                                                        );
                                                                    }}
                                                                    type="button"
                                                                >
                                                                    <span className="mr-2">
                                                                        Q
                                                                        {index +
                                                                            1}
                                                                        .
                                                                    </span>
                                                                    <span className="truncate">
                                                                        {q
                                                                            .question_text
                                                                            .length >
                                                                        40
                                                                            ? q.question_text.substring(
                                                                                  0,
                                                                                  40
                                                                              ) +
                                                                              "..."
                                                                            : q.question_text}
                                                                    </span>
                                                                    {selectedAnswers[
                                                                        q.id
                                                                    ] && (
                                                                        <span className="ml-auto">
                                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                                        </span>
                                                                    )}
                                                                </Button>
                                                                {/* Added invisible sheet close button that can be triggered programmatically */}
                                                                {currentQuestionIndex ===
                                                                    index && (
                                                                    <SheetClose
                                                                        ref={
                                                                            sheetCloseRef
                                                                        }
                                                                        className="hidden"
                                                                        onClick={() =>
                                                                            console.log(
                                                                                "Sheet closed"
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <Button
                                variant="default"
                                onClick={submitQuiz}
                                disabled={savingAnswer}
                                type="button" // Important: specify button type
                            >
                                Submit Quiz
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            onClick={goToNextQuestion}
                            disabled={
                                currentQuestionIndex === questions.length - 1
                            }
                            type="button" // Important: specify button type
                        >
                            Next <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    {/* Question Indicators */}
                    <div className="mt-6">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {questions.map((q, i) => (
                                <Button
                                    key={q.id}
                                    variant={
                                        currentQuestionIndex === i
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${
                                        flaggedQuestions[q.id]
                                            ? "border-yellow-500 border-2"
                                            : ""
                                    }`}
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    type="button" // Important: specify button type
                                >
                                    {selectedAnswers[q.id] ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        i + 1
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Canvas Drawing Modal for Images */}
            {isCanvasOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[80vh] max-w-4xl flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-semibold">Drawing Canvas</h3>
                            <div className="flex items-center space-x-2">
                                {/* Drawing Tools */}
                                <div className="flex space-x-1 mr-4">
                                    <Button
                                        variant={
                                            drawingTool === "pen"
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={setPen}
                                        type="button" // Important: specify button type
                                    >
                                        <PenTool className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={
                                            drawingTool === "eraser"
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={setEraser}
                                        type="button" // Important: specify button type
                                    >
                                        <Eraser className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearCanvas}
                                        type="button" // Important: specify button type
                                    >
                                        Clear
                                    </Button>
                                </div>

                                {/* Pen Settings */}
                                {drawingTool === "pen" && (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            value={penColor}
                                            onChange={(e) =>
                                                handleColorChange(
                                                    e.target.value
                                                )
                                            }
                                            className="w-8 h-8"
                                        />
                                        <select
                                            value={penSize}
                                            onChange={(e) =>
                                                handleSizeChange(e.target.value)
                                            }
                                            className="border rounded px-2 py-1"
                                        >
                                            <option value="1">Thin</option>
                                            <option value="2">Medium</option>
                                            <option value="4">Thick</option>
                                            <option value="6">
                                                Very Thick
                                            </option>
                                        </select>
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsCanvasOpen(false)}
                                    type="button" // Important: specify button type
                                >
                                    Close
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 relative p-4">
                            {/* Background Image */}
                            {currentQuestion?.image_path && (
                                <img
                                    src={getImageUrl(
                                        currentQuestion.image_path
                                    )}
                                    alt="Canvas background"
                                    className="absolute inset-0 w-full h-full object-contain p-4"
                                    onError={(e) => {
                                        console.error(
                                            "Canvas image load error:",
                                            e
                                        );
                                        e.target.src =
                                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIgLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEycHgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==";
                                        e.target.onerror = null; // Prevent infinite loop
                                    }}
                                />
                            )}

                            {/* Drawing Canvas */}
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseUp={finishDrawing}
                                onMouseMove={draw}
                                className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
