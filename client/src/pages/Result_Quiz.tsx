import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

const Result_Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { daContent, score, totalQuestions } = location.state || {};

  if (!daContent) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">No Results Found</h1>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Quiz Results
      </h1>

      <Card className="mb-6 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-medium">Your Score:</div>
            <div className="text-2xl font-bold text-green-600">
              {score} / {totalQuestions}
            </div>
          </div>
          <div className="mt-4 text-gray-600">
            <p>{daContent}</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={() => navigate("/student-dashboard")}>Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default Result_Quiz;
