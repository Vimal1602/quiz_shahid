
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, ShieldCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  
  // If already logged in, redirect to appropriate dashboard
  if (authState.isAuthenticated && authState.user) {
    navigate(`/${authState.user.role}-dashboard`);
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Quiz Quest Campus</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive platform for academic assessments and assignments
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
            <div className="flex flex-col items-center text-center">
              <GraduationCap className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Student Portal</h2>
              <p className="text-gray-600 mb-6">
                Access your quizzes and assignments for all your courses
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate('/login/student')}
              >
                Student Login
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Admin Portal</h2>
              <p className="text-gray-600 mb-6">
                Manage students, courses, and view assessment results
              </p>
              <Button
                className="w-full"
                onClick={() => navigate('/login/admin')}
                variant="outline"
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12 text-gray-500">
          <p>University Assessment System • Computer Science Department</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
