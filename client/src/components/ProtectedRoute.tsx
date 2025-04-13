
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: User['role'];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { authState } = useAuth();
  
  if (!authState.isAuthenticated) {
    return <Navigate to="/login/student" />;
  }
  
  if (authState.user && authState.user.role !== requiredRole) {
    // If user is logged in but with wrong role, redirect to their dashboard
    return <Navigate to={`/${authState.user.role}-dashboard`} />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
