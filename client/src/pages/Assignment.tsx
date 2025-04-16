
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { assignments, submitAssignment, getAssignmentSubmission } from "@/lib/quiz-data";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, FileText, Paperclip, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const Assignment = () => {
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [answer, setAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const assignment = assignments.find(a => a.id === id);
  // useEffect(() => {
  //   console.log(assignment);
  // }, [assignment]);
  
  // Check if the assignment has already been submitted
  useEffect(() => {
    if (!assignment || !authState.user) return;
    
    const existingSubmission = getAssignmentSubmission(assignment.id, authState.user.id);
    
    if (existingSubmission) {
      setAnswer(existingSubmission.answer);
      setIsSubmitted(true);
      setSubmittedAt(existingSubmission.submittedAt);
    }
  }, [assignment, authState.user]);
  
  if (!assignment || !authState.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Assignment not found</h1>
          <Button onClick={() => navigate("/student-dashboard")}>
            Go back to dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const handleSubmit = () => {
    if (answer.trim() === "") {
      toast({
        title: "Error",
        description: "Please provide an answer before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    submitAssignment({
      assignmentId: assignment.id,
      studentId: authState.user.id,
      answer,
      submittedAt: new Date().toISOString(),
      grade: null, // Will be graded by admin later
      feedback: null // Will be provided by admin later
    });
    
    setIsSubmitted(true);
    setSubmittedAt(new Date().toISOString());
    
    toast({
      title: "Assignment Submitted!",
      description: "Your assignment has been successfully submitted.",
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  
  const dueDate = new Date(assignment.dueDate);
  const isPastDue = new Date() > dueDate;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#222222] text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/student-dashboard")}
            className="text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-300 text-sm">
              {isSubmitted ? (
                <span className="flex items-center">
                  <span className="bg-green-500 h-2 w-2 rounded-full mr-2"></span>
                  Turned in {submittedAt && formatDate(submittedAt)}
                </span>
              ) : (
                <span>Not turned in</span>
              )}
            </div>
            
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitted}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Turn in
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-3 lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{assignment.title}</h1>
              <p className="text-gray-500">Due {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Instructions</h2>
                <p>{assignment.description}</p>
                <p className="text-gray-500 mt-2">Submit on or before {dueDate.toLocaleDateString()}.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
              <Textarea 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="min-h-[300px] resize-y"
                disabled={isSubmitted}
              />
              
              <div className="mt-6 flex">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitted || answer.trim() === ""}
                  className="mr-4"
                >
                  {isSubmitted ? "Submitted" : "Turn In"}
                </Button>
                {isSubmitted && (
                  <Button variant="outline" onClick={() => {
                    setIsSubmitted(false);
                    toast({
                      title: "Edit mode",
                      description: "You can now edit your submission. Don't forget to turn it in again!",
                    });
                  }}>
                    Edit submission
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-span-3 lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Reference materials</h2>
              <div 
                className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                onClick={() => setSheetOpen(true)}
              >
                <FileText className="h-5 w-5 mr-3 text-blue-600" />
                <span>{assignment.title}.docx</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">My work</h2>
              {isSubmitted ? (
                <div className="text-green-600 flex items-center">
                  <span>Submitted on {submittedAt && formatDate(submittedAt)}</span>
                </div>
              ) : (
<div className="flex items-center space-x-4">
  <input 
    type="file" 
    id="file-input" 
    className="hidden" 
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        // Handle the file upload logic here
        console.log("File selected:", file.name);
      }
    }} 
  />
  <Button 
    variant="outline" 
    className="flex items-center" 
    onClick={() => document.getElementById('file-input')?.click()}
  >
    <Paperclip className="h-4 w-4 mr-2" />
    Attach
  </Button>
  <Button variant="outline" className="flex items-center">
    <Plus className="h-4 w-4 mr-2" />
    New
  </Button>
</div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Reference material viewer */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[80%] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{assignment.title}.docx</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <div className="border rounded-md p-6 bg-gray-50">
              <h3 className="font-bold text-lg mb-4">{assignment.title}</h3>
              <p className="mb-4">{assignment.description}</p>
              <p className="mb-4">Please follow these steps to complete the assignment:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Research the topic thoroughly using academic sources.</li>
                <li>Analyze the problem statement and formulate your solution approach.</li>
                <li>Implement your solution with clear explanations.</li>
                <li>Provide references for all sources used.</li>
              </ol>
              <p className="mt-4">Submit your completed work before the deadline.</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Assignment;
