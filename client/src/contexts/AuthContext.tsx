import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, mockUsers, AuthState } from '../lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "../components/ui/toast";

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean; // Add loading state
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Load user from localStorage on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser) as User;
          
          // Verify the user exists in mockUsers (in a real app, verify with backend)
          const isValidUser = mockUsers.some(u => u.id === user.id);
          
          if (isValidUser) {
            setAuthState({
              user,
              isAuthenticated: true
            });
            
            // Redirect based on role if coming from login page
            if (location.pathname === '/login/student' || location.pathname === '/login') {
              navigate(user.role === 'student' ? '/student-dashboard' : '/admin-dashboard');
            }
          } else {
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [navigate, location.pathname]);

  const login = (email: string, password: string) => {
    const user = mockUsers.find(user => user.email === email);

    if (user && password === '123456') { // Simple mock password
      setAuthState({
        user,
        isAuthenticated: true
      });
      
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });

      navigate(user.role === 'student' ? '/student-dashboard' : '/admin-dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setAuthState(defaultAuthState);
    localStorage.removeItem('user');
    navigate('/login/student'); // Redirect to student login by default
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Don't render children until auth state is initialized
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ authState, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};