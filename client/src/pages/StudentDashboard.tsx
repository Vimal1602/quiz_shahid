// import { useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { quizzes, assignments, studentResults } from "@/lib/quiz-data";
// import { useNavigate } from "react-router-dom";
// import { 
//   BookOpen, 
//   ClipboardList, 
//   Calendar, 
//   Clock, 
//   CheckCircle, 
//   LogOut,
//   Award
// } from "lucide-react";

// const StudentDashboard = () => {
//   const { authState, logout } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("quizzes");
  
//   if (!authState.user) {
//     return null; // This should be caught by ProtectedRoute
//   }
  
//   const completedQuizIds = studentResults
//     .filter(result => result.studentId === authState.user?.id)
//     .map(result => result.quizId);
  
//   const isQuizCompleted = (quizId: string) => {
//     return completedQuizIds.includes(quizId);
//   };
  

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure to import axios for making API requests
import { BookOpen, ClipboardList, Calendar, Clock, CheckCircle, LogOut, Award } from "lucide-react";
// import { assignments } from "../lib/quiz-data"; // Assuming you have a file that exports assignments data
const StudentDashboard = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("quizzes");
  const [quizzes, setQuizzes] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  useEffect(() => {
    // Fetch quizzes from the API
    axios.get('http://localhost:5000/api/quizzes')
      .then(response => {
        setQuizzes(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the quizzes!", error);
      });
  }, []);

  if (!authState.user) {
    return null; // This should be caught by ProtectedRoute
  }

  useEffect(() => {
    // Fetch quizzes from the API
    axios.get(`http://localhost:5000/api/results/${authState.user.id}`)
      .then(response => {
        setStudentResults(response.data);
        console.log("Student Results:", response.data); // Debugging line to check fetched results
      })
      .catch(error => {
        console.error("There was an error fetching the results!", error);
      });
  }, []);

  useEffect(() => {
    // Fetch quizzes from the API
    axios.get(`http://localhost:5000/api/assignments`)
      .then(response => {
        setAssignments(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the assignments!", error);
      });
  }, []);


  const completedQuizIds = studentResults
    .filter(result => result.user_id === authState.user?.id)
    .map(result => result.quizId);

  const isQuizCompleted = (quizId: string) => {
    return completedQuizIds.includes(quizId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Quiz Quest Campus</h1>
            <p className="text-gray-500">Student Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{authState.user.name}</p>
              <p className="text-sm text-gray-500">{authState.user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
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
            {studentResults.filter(result => result.user_id === authState.user?.id).length > 0 ? (
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
                      .filter(result => result.user_id === authState.user?.id)
                      .map((result) => {
                        const quiz = quizzes.find(q => q.id === result.quizId);
                        return (
                          <tr key={`${result.quizId}-${result.user_id}`}>
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
