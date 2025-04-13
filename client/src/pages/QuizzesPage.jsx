import React from "react";
import { quizzes } from "@/lib/quiz-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const QuizzesPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const completedQuizIds = studentResults
    .filter(result => result.studentId === authState.user?.id)
    .map(result => result.quizId);

  const isQuizCompleted = (quizId) => completedQuizIds.includes(quizId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className={isQuizCompleted(quiz.id) ? "border-green-200" : ""}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>{quiz.title}</span>
              {isQuizCompleted(quiz.id) && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-2">{quiz.description}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{quiz.duration} minutes</span>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{quiz.subject}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="w-full"
              disabled={isQuizCompleted(quiz.id)}
            >
              {isQuizCompleted(quiz.id) ? "Completed" : "Start Quiz"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default QuizzesPage;
