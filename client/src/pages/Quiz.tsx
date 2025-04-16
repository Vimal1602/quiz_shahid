import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "../components/ui/dialog";
import { useIsMobile } from "../hooks/use-mobile";
// import { quizzes, studentResults } from "../lib/quiz-data";
import { useToast } from "../components/ui/use-toast";
import { AlertCircle, Clock, ArrowLeft, ArrowRight, CheckCircle, XCircle, Trophy } from "lucide-react";
import { motion } from "framer-motion";
const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState<'idle' | 'analyzing' | 'generating'>('idle');

  const [quiz, setQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState(null);
  useEffect(() => {
    // Fetch quiz data based on quizId
    axios.get(`http://localhost:5000/api/quizzes/`)
      .then(response => {
        setQuizzes(response.data);
        console.log(quizzes);
        const matchedQuiz = response.data.find(q => q.id === id);
      if (matchedQuiz) {
        setQuiz(matchedQuiz);
      } else {
        toast({
          title: "Quiz Not Found",
          description: "The requested quiz could not be found.",
          variant: "destructive",
        });}

      })
      .catch(error => {
        console.error("There was an error fetching the quiz!", error);
        toast({
          title: "Error",
          description: "Failed to load the quiz. Please try again later.",
          variant: "destructive",
        });
      });
  }, [id]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isTimeoutDialogOpen, setIsTimeoutDialogOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  // const quiz = quizzes.find(q => q.id === id);
  // const [timeLeft, setTimeLeft] = useState(quiz ? quiz.duration * 60 : 0);
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (quiz && quiz.duration) {
      setTimeLeft(quiz.duration * 60);
    }
  }, [quiz]);
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize answers array
  useEffect(() => {
    if (quiz) {
      setAnswers(new Array(quiz.questions.length).fill(-1));
    }
  }, [quiz]);

  // Set up timer
  useEffect(() => {
    if (!quiz) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeoutDialogOpen(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  // Handle answer selection
  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    setSelectedOption(answerIndex);
    setShowAnswer(true);

    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        handleNextQuestion();
      } else {
        setShowCompletionDialog(true);
      }
    }, 1000);
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
      setSelectedOption(null);
    }
  };

  // Move to previous question
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowAnswer(false);
      setSelectedOption(null);
    }
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (!quiz || !authState.user) return;
  
    setIsSubmitting(true);
    setSubmitStatus('analyzing');
    const user = localStorage.getItem('user');
    const email = user ? JSON.parse(user).email : null;
    const name = user ? JSON.parse(user).name : null;
    
    if (!email) {
      toast({
        title: "Error",
        description: "Email not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }
  
    // Calculate score
    const score = answers.reduce((total, answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        return total + 1;
      }
      return total;
    }, 0);
  
    // Prepare submission data with options content
    const submissionData = {
      quizId: quiz.id,
      userId: authState.user.id,
      userDetails: {
        name: name,
        email: email
      },
      answers: answers.map((answer, index) => ({
        questionId: quiz.questions[index].id,
        questionText: quiz.questions[index].text,
        selectedOptionIndex: answer,
        selectedOptionContent: answer !== -1 ? quiz.questions[index].options[answer] : null,
        correctOptionIndex: quiz.questions[index].correctAnswer,
        correctOptionContent: quiz.questions[index].options[quiz.questions[index].correctAnswer],
        isCorrect: answer === quiz.questions[index].correctAnswer,
        options: quiz.questions[index].options.map((option, i) => ({
          index: i,
          content: option,
          isCorrect: i === quiz.questions[index].correctAnswer,
          isSelected: i === answer
        }))
      })),
      score,
      totalQuestions: quiz.questions.length,
      timeSpent: quiz.duration * 60 - timeLeft
    };
  
    // Comprehensive console logging
    console.log("========== QUIZ SUBMISSION DATA ==========");
    console.log("Basic Info:");
    console.log("- Quiz ID:", submissionData.quizId);
    console.log("- User ID:", submissionData.userId);
    console.log("- User Name:", submissionData.userDetails.name);
    console.log("- User Email:", submissionData.userDetails.email);
    console.log("- Final Score:", `${submissionData.score}/${submissionData.totalQuestions}`);
    console.log("- Time Spent:", submissionData.timeSpent, "seconds");
    
    console.log("\nDetailed Answers:");
    submissionData.answers.forEach((answer, idx) => {
      console.log(`\nQuestion ${idx + 1}: ${answer.questionText}`);
      console.log("- Selected Option:", 
        answer.selectedOptionIndex !== -1 
          ? `#${answer.selectedOptionIndex + 1}: ${answer.selectedOptionContent}`
          : "Not answered");
      console.log("- Correct Option:", 
        `#${answer.correctOptionIndex + 1}: ${answer.correctOptionContent}`);
      console.log("- Result:", answer.isCorrect ? "CORRECT" : "INCORRECT");
      
      console.log("\nAll Options:");
      answer.options.forEach(option => {
        console.log(
          `  ${option.index + 1}. ${option.content}` +
          `${option.isCorrect ? " (Correct)" : ""}` +
          `${option.isSelected ? " (Selected)" : ""}`
        );
      });
    });
  
    console.log("\nFull Submission Data Object:");
    console.log(JSON.stringify(submissionData, null, 2));
    console.log("=========================================");
  
    try {
      setSubmitStatus('generating');
      
      // First save the quiz results
      const saveResponse = await fetch('http://localhost:5000/api/save-quiz-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
  
      if (!saveResponse.ok) throw new Error('Failed to save quiz results');
  
      // Then generate the DA
      const daResponse = await fetch('http://localhost:8000/generate-da', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
  
      if (!daResponse.ok) throw new Error('Failed to generate DA');
  
      const result = await daResponse.json();
      
      toast({
        title: "Quiz Submitted!",
        description: `Your DA has been generated successfully! Score: ${score}/${quiz.questions.length}`,
      });
  
      // Navigate to results page with DA data
      navigate('/student-dashboard', { 
        state: { 
          daContent: result.daContent,
          score,
          totalQuestions: quiz.questions.length
        } 
      });
  
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was an error processing your quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setSubmitStatus('idle');
    }
  };
  

  const handleReviewAnswers = () => {
    setShowCompletionDialog(false);
    setReviewMode(true);
    setCurrentQuestion(0);
  };

  const getOptionColor = (optionIndex: number) => {
    if (!quiz) return "";

    if (reviewMode) {
      if (optionIndex === quiz.questions[currentQuestion].correctAnswer) {
        return "bg-green-500/20 border-green-500 text-green-600";
      }
      if (answers[currentQuestion] === optionIndex && answers[currentQuestion] !== quiz.questions[currentQuestion].correctAnswer) {
        return "bg-red-500/20 border-red-500 text-red-600";
      }
      return "";
    }

    if (showAnswer) {
      if (optionIndex === quiz.questions[currentQuestion].correctAnswer) {
        return "bg-green-500/20 border-green-500 text-green-600";
      }
      if (optionIndex === selectedOption && optionIndex !== quiz.questions[currentQuestion].correctAnswer) {
        return "bg-red-500/20 border-red-500 text-red-600";
      }
    }

    return "";
  };

  const isAnswered = answers[currentQuestion] !== -1;
  const isCorrect = isAnswered && quiz && answers[currentQuestion] === quiz.questions[currentQuestion]?.correctAnswer;
  const correctAnswers = quiz ? answers.reduce((total, answer, index) => {
    return answer === quiz.questions[index].correctAnswer ? total + 1 : total;
  }, 0) : 0;

  // if (!quiz) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
  //         <Button onClick={() => navigate("/student-dashboard")}>
  //           Go back to dashboard
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  const currentQuestionData = quiz?.questions?.[currentQuestion];
  const isLastQuestion = quiz ? currentQuestion === quiz.questions.length - 1 : false;

  if (answers.length === 0 || !currentQuestionData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Loading quiz...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 lg:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <Button
            variant="outline"
            className="flex items-center space-x-2 border-border text-foreground hover:bg-secondary"
            onClick={() => navigate("/student-dashboard")}
          >
            <ArrowLeft size={16} />
            <span className={isMobile ? "hidden" : "inline"}>Dashboard</span>
          </Button>

          <div className="flex items-center">
            <div className={`quiz-timer ${timeLeft < 300 ? "text-amber-600" : ""} flex items-center`}>
              <Clock className="h-5 w-5 mr-2" />
              Time Remaining: {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
          <div className="h-1 bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <h3 className="text-foreground font-medium">Question {currentQuestion + 1} of {quiz.questions.length}</h3>
              {(isAnswered || reviewMode) && (
                <div className="flex items-center">
                  {isCorrect ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <CheckCircle size={16} className="mr-1" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600 text-sm">
                      <XCircle size={16} className="mr-1" /> Incorrect
                    </span>
                  )}
                </div>
              )}
            </div>

            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 lg:mb-8"
            >
              <h2 className="text-lg lg:text-xl font-medium text-foreground mb-4 lg:mb-6">
                {currentQuestionData.text}
              </h2>

              <RadioGroup
                value={answers[currentQuestion] === -1 ? undefined : answers[currentQuestion].toString()}
                onValueChange={(value) => handleSelectAnswer(parseInt(value))}
              >
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 mb-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer ${getOptionColor(index)}`}
                    onClick={() => !showAnswer && !reviewMode && handleSelectAnswer(index)}
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      disabled={showAnswer || reviewMode}
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <div className="flex items-start">
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${showAnswer || reviewMode
                            ? index === currentQuestionData.correctAnswer
                              ? "border-green-500 bg-green-500/10"
                              : answers[currentQuestion] === index && index !== currentQuestionData.correctAnswer
                                ? "border-red-500 bg-red-500/10"
                                : "border-muted-foreground/50"
                            : "border-muted-foreground/50"
                          }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {reviewMode && answers[currentQuestion] === index && (
                        <div className="text-xs mt-2 text-muted-foreground">
                          (Your choice)
                        </div>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>

            <div className="flex justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center border-border hover:bg-secondary"
              >
                <ArrowLeft size={16} className="mr-2" /> Previous
              </Button>

              {isLastQuestion && (answers.every(a => a !== -1) || reviewMode) ? (
                <Button
                  onClick={() => {
                    if (reviewMode) {
                      setShowCompletionDialog(true);
                      setReviewMode(false);
                    } else {
                      setShowCompletionDialog(true);
                    }
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center"
                >
                  {reviewMode ? "Exit Review" : "Finish Quiz"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleNextQuestion}
                  disabled={!isAnswered && !reviewMode}
                  className="flex items-center border-border hover:bg-secondary"
                >
                  Next <ArrowLeft size={16} className="ml-2 transform rotate-180" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 lg:mt-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {quiz.questions.map((_, index) => (
              <motion.div
                key={index}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${index === currentQuestion
                    ? "bg-primary text-primary-foreground"
                    : answers[index] !== -1
                      ? answers[index] === quiz.questions[index].correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-muted"
                  }`}
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  if (reviewMode || answers[index] !== -1) {
                    setCurrentQuestion(index);
                  }
                }}
              >
                {index + 1}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              {answers.filter(a => a === -1).length > 0 ? (
                <div className="text-amber-600 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  You have {answers.filter(a => a === -1).length} unanswered questions.
                </div>
              ) : (
                "Are you sure you want to submit the quiz? You won't be able to change your answers after submission."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Back to Quiz
            </Button>
            <Button onClick={handleSubmit}>
              Submit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time's Up Dialog */}
      <AlertDialog open={isTimeoutDialogOpen} onOpenChange={setIsTimeoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              Your time has run out. The quiz will be submitted with your current answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmit}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-xl">
              <Trophy className="mr-2 h-6 w-6 text-primary" />
              Quiz Completed!
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              You've completed {quiz.title}
            </DialogDescription>
          </DialogHeader>

          <div className="text-center py-6">
            <div className="text-4xl font-bold mb-2 text-primary">
              {correctAnswers} / {quiz.questions.length}
            </div>
            <p className="text-muted-foreground">
              {correctAnswers === quiz.questions.length ? "Perfect score! Amazing work!" :
                correctAnswers >= quiz.questions.length * 0.8 ? "Great job! Almost perfect!" :
                  correctAnswers >= quiz.questions.length * 0.6 ? "Good work! Keep practicing!" :
                    "Keep studying! You'll do better next time!"}
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleReviewAnswers}
              className="flex-1 border-border hover:bg-secondary"
            >
              Review Answers
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  {submitStatus === 'analyzing' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing Answers...
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating DA...
                    </>
                  )}
                </div>
              ) : (
                'Finish'
              )}
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Quiz;