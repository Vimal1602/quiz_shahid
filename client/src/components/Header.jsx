import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Header = () => {
  const { authState, logout } = useAuth();
    const navigate=useNavigate();

  if (!authState.user) return null;

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => navigate("/student-dashboard")} >
        <h1 
  
  className="text-2xl cursor-pointer font-bold text-primary"
>
  Quiz Quest Campus
</h1>
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
  );
};

export default Header;
