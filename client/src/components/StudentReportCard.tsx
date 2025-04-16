import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter 
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "../components/ui/table";
import { FileText, Download, Printer } from "lucide-react";
import { useToast } from "../components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  year: string;
  rollNumber: string;
  photoUrl?: string;
}

interface AcademicRecord {
  id: string;
  semester: string;
  subjects: {
    name: string;
    code: string;
    marks: number;
    maxMarks: number;
    grade: string;
  }[];
  overallPercentage: number;
  rank?: number;
  files: {
    name: string;
    url: string;
  }[];
}

const StudentReportCard = () => {
  const { studentId } = useParams();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        //student report data shown by shahid 
        const studentResponse = await fetch(`http://localhost:3000/api/students/${studentId}`);
        const studentData = await studentResponse.json();
        
        const recordsResponse = await fetch(`http://localhost:3000/api/students/${studentId}/records`);
        const recordsData = await recordsResponse.json();
        
        setStudent(studentData);
        setAcademicRecords(recordsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load student data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  // Dummy data for demonstration
  const dummyStudent: Student = {
    id: studentId || "12345",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    program: "Computer Science",
    year: "2023",
    rollNumber: "CS2023001",
    photoUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  const dummyRecords: AcademicRecord[] = [
    {
      id: "1",
      semester: "Fall 2022",
      overallPercentage: 85.5,
      rank: 12,
      files: [{ name: "Report_Fall2022.pdf", url: "#" }],
      subjects: [
        { name: "Data Structures", code: "CS201", marks: 88, maxMarks: 100, grade: "A" },
        { name: "Algorithms", code: "CS202", marks: 92, maxMarks: 100, grade: "A+" },
        { name: "Database Systems", code: "CS203", marks: 78, maxMarks: 100, grade: "B+" },
        { name: "Computer Networks", code: "CS204", marks: 85, maxMarks: 100, grade: "A" },
      ]
    },
    {
      id: "2",
      semester: "Spring 2023",
      overallPercentage: 82.0,
      rank: 15,
      files: [{ name: "Report_Spring2023.pdf", url: "#" }],
      subjects: [
        { name: "Operating Systems", code: "CS301", marks: 84, maxMarks: 100, grade: "A" },
        { name: "Software Engineering", code: "CS302", marks: 79, maxMarks: 100, grade: "B+" },
        { name: "Artificial Intelligence", code: "CS303", marks: 88, maxMarks: 100, grade: "A" },
        { name: "Computer Architecture", code: "CS304", marks: 77, maxMarks: 100, grade: "B+" },
      ]
    },
    {
      id: "3",
      semester: "Fall 2023",
      overallPercentage: 87.5,
      rank: 8,
      files: [{ name: "Report_Fall2023.pdf", url: "#" }],
      subjects: [
        { name: "Machine Learning", code: "CS401", marks: 91, maxMarks: 100, grade: "A+" },
        { name: "Cloud Computing", code: "CS402", marks: 85, maxMarks: 100, grade: "A" },
        { name: "Big Data Analytics", code: "CS403", marks: 89, maxMarks: 100, grade: "A" },
        { name: "Cybersecurity", code: "CS404", marks: 85, maxMarks: 100, grade: "A" },
      ]
    }
  ];

  const displayStudent = student || dummyStudent;
  const displayRecords = academicRecords.length > 0 ? academicRecords : dummyRecords;

  return (
    <div className="space-y-6">
      {/* Student Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle>Student Report Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {displayStudent.photoUrl && (
              <div className="w-32 h-32 rounded-lg overflow-hidden border">
                <img 
                  src={displayStudent.photoUrl} 
                  alt={displayStudent.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div>
                <h3 className="text-xl font-semibold">{displayStudent.name}</h3>
                <p className="text-gray-500">{displayStudent.email}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">Roll No:</span> {displayStudent.rollNumber}</p>
                <p><span className="font-medium">Program:</span> {displayStudent.program}</p>
                <p><span className="font-medium">Year:</span> {displayStudent.year}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Academic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {displayRecords.map((record) => (
              <div key={record.id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
                  <h4 className="font-medium">{record.semester}</h4>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">
                      <span className="font-medium">Overall:</span> {record.overallPercentage}%
                    </span>
                    {record.rank && (
                      <span className="text-sm">
                        <span className="font-medium">Rank:</span> {record.rank}
                      </span>
                    )}
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead className="text-right">Marks</TableHead>
                      <TableHead className="text-right">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {record.subjects.map((subject) => (
                      <TableRow key={`${record.id}-${subject.code}`}>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.code}</TableCell>
                        <TableCell className="text-right">
                          {subject.marks}/{subject.maxMarks}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            subject.grade === 'A+' ? 'bg-green-100 text-green-800' :
                            subject.grade.startsWith('A') ? 'bg-blue-100 text-blue-800' :
                            subject.grade.startsWith('B') ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {subject.grade}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StudentReportCard;