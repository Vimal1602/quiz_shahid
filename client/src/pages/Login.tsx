
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, ShieldCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { role } = useParams<{ role: string }>();
  const { login } = useAuth();
  
  const isAdmin = role === 'admin';
  
  // Default emails for demo purposes
  const defaultEmail = isAdmin ? 'admin@university.edu' : 'shahid@vitstudent.ac.in';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              {isAdmin ? 
                <ShieldCheck className="h-12 w-12 text-primary" /> : 
                <GraduationCap className="h-12 w-12 text-primary" />
              }
            </div>
            <CardTitle className="text-center text-2xl">
              {isAdmin ? 'Admin Login' : 'Student Login'}
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the {isAdmin ? 'admin' : 'student'} portal
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={defaultEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="123456 (For demo)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>For demo purposes: Use {defaultEmail} with password 123456</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
