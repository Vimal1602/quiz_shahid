import React from "react";
import { studentResults, quizzes } from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const ResultsPage = () => {
  const { authState } = useAuth();

  const filteredResults = studentResults.filter(result => result.studentId === authState.user?.id);

  return (
    <div>
      {filteredResults.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => {
                const quiz = quizzes.find(q => q.id === result.quizId);
                return (
                  <tr key={`${result.quizId}-${result.studentId}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{quiz?.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{quiz?.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {result.score}/{quiz?.questions.length} ({Math.round((result.score / (quiz?.questions.length || 1)) * 100)}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(result.completedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.timeSpent} minutes
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't completed any quizzes yet.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/quizzes")}
          >
            Browse Available Quizzes
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
