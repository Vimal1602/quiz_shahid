
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  quizzes, 
  students, 
  studentResults, 
  assignments, 
  assignmentSubmissions,
  Student
} from "@/lib/quiz-data";
import { ArrowLeft, User, FileText, CheckCircle } from "lucide-react";
import StudentReportCard from "../components/StudentReportCard";

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  
  // Find the student with the given ID
  const student = students.find(s => s.id === id);
  
  // Get student quiz results
  const results = studentResults.filter(result => result.studentId === id);
  
  // Get student assignment submissions
  const submissions = assignmentSubmissions.filter(sub => sub.studentId === id);
  
  if (!authState.user || authState.user.role !== "admin") {
    return <div>Unauthorized</div>;
  }
  
  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Student not found</h1>
          <Button onClick={() => navigate("/admin-dashboard")}>
            Go back to dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.title : "Unknown Quiz";
  };
  
  const getAssignmentTitle = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    return assignment ? assignment.title : "Unknown Assignment";
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin-dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Student Profile</h1>
              <p className="text-gray-500">{student.name}</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center justify-center">
              <User className="h-4 w-4 mr-2" />
              Student Details
            </TabsTrigger>
            <TabsTrigger value="quizResults" className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Quiz Results
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center justify-center">
              <FileText className="h-4 w-4 mr-2" />
              Assignment Submissions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-500 text-sm">Full Name</h3>
                      <p className="mt-1">{student.name}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 text-sm">Email Address</h3>
                      <p className="mt-1">{student.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 text-sm">Program</h3>
                      <p className="mt-1">{student.program}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 text-sm">Year</h3>
                      <p className="mt-1">{student.year}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-500 text-sm">Academic Progress</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600">Quizzes Completed</p>
                        <p className="text-2xl font-bold">{results.length} / {quizzes.length}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Assignments Submitted</p>
                        <p className="text-2xl font-bold">{submissions.length} / {assignments.length}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600">Average Quiz Score</p>
                        <p className="text-2xl font-bold">
                          {results.length > 0 
                            ? `${Math.round(results.reduce((acc, r) => {
                                const quiz = quizzes.find(q => q.id === r.quizId);
                                const totalQuestions = quiz ? quiz.questions.length : 0;
                                return acc + (r.score / totalQuestions * 100);
                              }, 0) / results.length)}%`
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <p className="text-sm text-amber-600">Average Assignment Grade</p>
                        <p className="text-2xl font-bold">
                          {submissions.filter(s => s.grade !== null).length > 0 
                            ? `${Math.round(submissions.filter(s => s.grade !== null)
                                .reduce((acc, s) => acc + (s.grade || 0), 0) 
                                / submissions.filter(s => s.grade !== null).length)}`
                            : 'Not graded'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><div>
                              <StudentReportCard/>
                              </div>
              </CardHeader>
            </Card>
          </TabsContent>
          
          <TabsContent value="quizResults">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No quiz results available for this student.</p>
                ) : (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((result, index) => {
                          const quiz = quizzes.find(q => q.id === result.quizId);
                          const totalQuestions = quiz ? quiz.questions.length : 0;
                          
                          return (
                            <tr key={`${result.quizId}-${result.studentId}-${index}`}>
                              <td className="px-6 py-4 whitespace-nowrap">{getQuizTitle(result.quizId)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {result.score}/{totalQuestions} ({Math.round((result.score / totalQuestions) * 100)}%)
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(result.completedAt).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.timeSpent} min
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No assignment submissions available for this student.</p>
                ) : (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {submissions.map((submission, index) => (
                          <tr key={`${submission.assignmentId}-${submission.studentId}-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap">{getAssignmentTitle(submission.assignmentId)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(submission.submittedAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {submission.grade !== null ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {submission.grade}/100
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Not graded
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {submission.feedback || "No feedback provided"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentProfile;
