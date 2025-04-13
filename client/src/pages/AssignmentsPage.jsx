import React from "react";
import { assignments } from "@/lib/quiz-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const AssignmentsPage = () => {
  const navigate = useNavigate();

  return (
    <div onClick={()=>navigate("/student-dashboard")} className="">
                <button className="border-2 p-4 m-4 mb-4 flex items-center gap-4 ml-8 m-4 border-black rounded-xl"><span><IoIosArrowBack /></span>Back to Dashboard</button>

    <div className="grid grid-cols-1 w-[80%] mx-auto md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader>
            <CardTitle>{assignment.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-2">{assignment.description}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{assignment.subject}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate(`/assignment/${assignment.id}`)}
            >
              View Assignment
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    </div>

  );
};

export default AssignmentsPage;
