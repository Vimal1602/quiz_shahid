import React from 'react';
import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import QuizzesPage from './pages/QuizzesPage';
import AssignmentsPage from './pages/AssignmentsPage';
import ResultsPage from './pages/ResultsPage';
import Layout from './Layout'; // ✅ correct import

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

              {/* ✅ Pages with layout */}
              <Route 
                path="/student-dashboard" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Layout>
                      <StudentDashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/quizzes" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Layout>
                      <QuizzesPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/assignments" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Layout>
                      <AssignmentsPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/results" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Layout>
                      <ResultsPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              {/* ✅ Admin dashboard with layout */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/student-profile/:id" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Layout>
                      <StudentProfile />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/quiz/:id" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Layout>
                      <Quiz />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/assignment/:id" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Layout>
                      <Assignment />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ToastRootProvider>
);

export default App;
