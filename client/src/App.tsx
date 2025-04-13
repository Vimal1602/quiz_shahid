import React from 'react';
import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../src/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Quiz from "./pages/Quiz";
import Assignment from "./pages/Assignment";
import StudentProfile from "./pages/StudentProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastRootProvider } from './components/ui/toast';

const queryClient = new QueryClient();

const App = () => (
  <ToastRootProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login/:role" element={<Login />} />
            
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/student-profile/:id" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/quiz/:id" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Quiz />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/assignment/:id" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Assignment />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ToastRootProvider>
);

export default App;