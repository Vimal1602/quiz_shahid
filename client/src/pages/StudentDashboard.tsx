import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { quizzes, assignments, studentResults } from "@/lib/quiz-data";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  Clock, 
  CheckCircle, 
  LogOut,
  Award
} from "lucide-react";

const StudentDashboard = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("quizzes");
  const [selectedTab, setSelectedTab] = useState("overview"); // Default tab can be "overview" or other
  const [daContent, setDaContent] = useState(null);
  
  if (!authState.user) {
    return null; // This should be caught by ProtectedRoute
  }
  
  const completedQuizIds = studentResults
    .filter(result => result.studentId === authState.user?.id)
    .map(result => result.quizId);
  
  const isQuizCompleted = (quizId: string) => {
    return completedQuizIds.includes(quizId);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
     
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="quizzes" className="flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                Quizzes
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Digital Assignments
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                My Results
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="quizzes">
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
          </TabsContent>
          
        <TabsContent value="assignments">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-2">{assignment.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{assignment.subject}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(`/assignment/${assignment.id}`)}
                >
                  View Assignment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
          <TabsContent value="results">
            {studentResults.filter(result => result.studentId === authState.user?.id).length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentResults
                      .filter(result => result.studentId === authState.user?.id)
                      .map((result) => {
                        const quiz = quizzes.find(q => q.id === result.quizId);
                        return (
                          <tr key={`${result.quizId}-${result.studentId}`}>
                            <td className="px-6 py-4 whitespace-nowrap">{quiz?.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{quiz?.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {result.score}/{quiz?.questions.length} ({Math.round((result.score / (quiz?.questions.length || 1)) * 100)}%)
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(result.completedAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.timeSpent} minutes
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't completed any quizzes yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("quizzes")}
                >
                  Browse Available Quizzes
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
