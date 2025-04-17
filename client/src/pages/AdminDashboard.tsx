import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import axios from "axios";

import { 
  quizzes, 
  students, 
  // studentResults, 
  assignments, 
  assignmentSubmissions,
  AssignmentSubmission,
  gradeAssignment  
} from "@/lib/quiz-data";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, Search, Users, FileText, CheckCircle, Award, PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const AdminDashboard = () => {
  const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);
const [newQuizSubject, setNewQuizSubject] = useState("");

  const { authState, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState<number | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quizList, setQuizList] = useState(quizzes); // State for quizzes
  const [studentResults, setStudentResults] = useState([]); // State for student results
  
  if (!authState.user || authState.user.role !== "admin") {
    return null; // This should be caught by ProtectedRoute
  }
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getQuizTitle = (quizId: string) => {
    const quiz = quizList.find(q => q.id === quizId);
    return quiz ? quiz.title : "Unknown Quiz";
  };
  
  const getAssignmentTitle = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    return assignment ? assignment.title : "Unknown Assignment";
  };



  useEffect(() => {
      // Fetch quizzes from the API
      axios.get(`http://localhost:5001/api/results/`)
        .then(response => {
          setStudentResults(response.data);
          console.log("Student Results:", response.data); // Debugging line to check fetched results
        })
        .catch(error => {
          console.error("There was an error fetching the results!", error);
        });
    }, []);
  
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : "Unknown Student";
  };
  
  const handleGradeSubmit = () => {
    if (selectedSubmission && grade !== undefined) {
      gradeAssignment(
        selectedSubmission.assignmentId,
        selectedSubmission.studentId,
        grade,
        feedback
      );
      
      toast({
        title: "Assignment graded",
        description: "The grade and feedback have been saved.",
      });
      
      setIsDialogOpen(false);
      setSelectedSubmission(null);
      setFeedback("");
      setGrade(undefined);
    }
  };
  
  const openGradeDialog = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setFeedback(submission.feedback || "");
    setGrade(submission.grade || undefined);
    setIsDialogOpen(true);
  };

  const fetchQuizzes = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      setQuizList(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleAddQuiz = async () => {
    if (!newQuizSubject) {
      toast({
        title: "Error",
        description: "Please enter a subject name",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: newQuizSubject ,num_questions: 10}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }
  
      const newQuiz = await response.json();
      setQuizList([...quizList, newQuiz]);
      setNewQuizSubject("");
      setIsAddQuizDialogOpen(false);
      
      toast({
        title: "Quiz created",
        description: `New quiz for ${newQuizSubject} has been added.`,
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to create new quiz",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Quiz Quest Campus</h1>
            <p className="text-gray-500">Admin Dashboard</p>
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
              <TabsTrigger value="students" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Students
              </TabsTrigger>
              <TabsTrigger value="quizResults" className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Quiz Results
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                DA Submissions (Digital Assignment)
              </TabsTrigger>
            </TabsList>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quizzes Completed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => {
                        const quizCount = studentResults.filter(result => result.studentId === student.id).length;
                        const assignmentCount = assignmentSubmissions.filter(sub => sub.studentId === student.id).length;
                        
                        return (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                className="text-blue-600 hover:underline hover:text-blue-800 focus:outline-none"
                                onClick={() => navigate(`/student-profile/${student.id}`)}
                              >
                                {student.name}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.program}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.year}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{quizCount} / {quizList.length}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{assignmentCount} / {assignments.length}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quizResults">
            <Card>
              <CardHeader>
                <CardTitle>Edit / Add  Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Grid Layout for Quizzes */}
                <div className="border-2 border-dashed rounded-lg flex items-center justify-center h-32 cursor-pointer hover:bg-gray-50 transition-colors">
  <Dialog open={isAddQuizDialogOpen} onOpenChange={setIsAddQuizDialogOpen}>
    <DialogTrigger asChild>
      <div className="text-center w-full h-full flex items-center justify-center">
        <PlusCircle className="w-8 h-8 mx-auto text-gray-400" />
        <p className="mt-2 text-sm justify-center font-medium">Add Quiz</p>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Quiz</DialogTitle>
        <DialogDescription>
          Enter the subject name to generate a new quiz.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="subject" className="text-right">
            Subject
          </label>
          <Input
            id="subject"
            value={newQuizSubject}
            onChange={(e) => setNewQuizSubject(e.target.value)}
            placeholder="e.g. Mathematics, History"
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsAddQuizDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleAddQuiz}>
          Create Quiz
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>

                <CardTitle className="text-2xl  mt-8 mb-8 ">All Student Quiz Results </CardTitle>

                {/* Quiz Results Table */}
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent (min)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentResults
                        .filter(result => 
                          getStudentName(result.studentId).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          getQuizTitle(result.quizId).toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((result, index) => {
                          const quiz = quizList.find(q => q.id === result.quizId);
                          const totalQuestions = quiz ? quiz.questions.length : 0;
                          
                          return (
                            <tr key={`${result.quizId}-${result.studentId}-${index}`}>
                              <td className="px-6 py-4 whitespace-nowrap">{getStudentName(result.studentId)}</td>
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
                                {result.timeSpent}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              
            </Card>
          </TabsContent>

          {/* <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assignmentSubmissions
                        .filter(submission => 
                          getStudentName(submission.studentId).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          getAssignmentTitle(submission.assignmentId).toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((submission, index) => (
                          <tr key={`${submission.assignmentId}-${submission.studentId}-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap">{getStudentName(submission.studentId)}</td>
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openGradeDialog(submission)}
                              >
                                <Award className="h-4 w-4 mr-2" />
                                {submission.grade !== null ? "Update Grade" : "Grade"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
          <TabsContent value="assignments">
          {studentResults.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studentResults
                    // .filter(result => result.user_id === authState.user?.id)
                    .map((result) => (
                      <Card key={result._id}>
                        <CardHeader>
                          <CardTitle>Digital Assignment: {result.quizId}</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-y-auto max-h-72">
                          <div className="text-gray-700 text-sm whitespace-pre-line">
                            {result.analysis}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) :(
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
      
      {/* Grade Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Grade Assignment</DialogTitle>
            <DialogDescription>
              Review the student's work and provide a grade and feedback.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Assignment</h3>
                <p>{getAssignmentTitle(selectedSubmission.assignmentId)}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Student</h3>
                <p>{getStudentName(selectedSubmission.studentId)}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Submitted</h3>
                <p>{new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Student's Answer</h3>
                <div className="border rounded-md p-3 bg-gray-50 max-h-[200px] overflow-y-auto">
                  {selectedSubmission.answer}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Grade (out of 100)</h3>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={grade?.toString() || ""}
                  onChange={(e) => setGrade(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Feedback</h3>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback to the student..."
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGradeSubmit}>
              Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;