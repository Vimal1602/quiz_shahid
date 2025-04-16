import mongoose from "mongoose";
import { Quiz } from "./models/Quiz.js";
import { Assignment } from "./models/Assignment.js";

// Sample quizzes (use your actual data)
const quizzes = [
    {
      id: "dsa-101",
      title: "Data Structures Fundamentals",
      description: "Test your knowledge on basic data structures including arrays, linked lists, stacks, and queues.",
      subject: "Data Structures & Algorithms",
      duration: 30,
      questions: [
        {
          id: 1,
          text: "Which data structure operates on a LIFO principle?",
          options: ["Queue", "Stack", "Linked List", "Tree"],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "What is the time complexity of searching an element in a sorted array using binary search?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
          correctAnswer: 2
        },
        {
          id: 3,
          text: "Which of these is not a linear data structure?",
          options: ["Array", "Queue", "Stack", "Tree"],
          correctAnswer: 3
        },
        {
          id: 4,
          text: "What's the main advantage of a linked list over an array?",
          options: ["Faster search operations", "Dynamic size", "Less memory usage", "Random access"],
          correctAnswer: 1
        },
        {
          id: 5,
          text: "Which sorting algorithm has the best average-case time complexity?",
          options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
          correctAnswer: 2
        }
      ]
    },
    {
      id: "db-201",
      title: "Database Management Systems",
      description: "Evaluate your understanding of database concepts, SQL queries, and normalization.",
      subject: "Database Systems",
      duration: 30,
      questions: [
        {
          id: 1,
          text: "Which normal form eliminates transitive dependencies?",
          options: ["First Normal Form", "Second Normal Form", "Third Normal Form", "Boyce-Codd Normal Form"],
          correctAnswer: 2
        },
        {
          id: 2,
          text: "What is the SQL command to retrieve data from a database?",
          options: ["GET", "RETRIEVE", "SELECT", "FETCH"],
          correctAnswer: 2
        },
        {
          id: 3,
          text: "Which type of join returns rows when there is a match in one of the tables?",
          options: ["INNER JOIN", "FULL OUTER JOIN", "LEFT JOIN", "RIGHT JOIN"],
          correctAnswer: 2
        },
        {
          id: 4,
          text: "What does ACID stand for in database context?",
          options: [
            "Atomicity, Consistency, Isolation, Durability",
            "Association, Completion, Isolation, Durability",
            "Atomicity, Completion, Integration, Delivery",
            "Authentication, Consistency, Isolation, Dependency"
          ],
          correctAnswer: 0
        },
        {
          id: 5,
          text: "Which of the following is not a type of database index?",
          options: ["B-Tree Index", "Hash Index", "Queue Index", "Bitmap Index"],
          correctAnswer: 2
        }
      ]
    },
    {
      id: "os-301",
      title: "Operating Systems Concepts",
      description: "Test your knowledge of OS principles, memory management, and process scheduling.",
      subject: "Operating Systems",
      duration: 30,
      questions: [
        {
          id: 1,
          text: "Which scheduling algorithm selects the process with the shortest expected processing time?",
          options: ["First-Come, First-Served", "Round Robin", "Shortest Job First", "Priority Scheduling"],
          correctAnswer: 2
        },
        {
          id: 2,
          text: "What is thrashing in an operating system?",
          options: [
            "A type of computer virus",
            "A method of defragmenting disk space",
            "When a process spends more time paging than executing",
            "A technique for optimizing CPU usage"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          text: "Which of these is not a process state?",
          options: ["Running", "Ready", "Waiting", "Compiling"],
          correctAnswer: 3
        },
        {
          id: 4,
          text: "What does the term 'mutex' stand for?",
          options: ["Multiple Execution", "Mutual Exclusion", "Multiple Extension", "Mutual Extraction"],
          correctAnswer: 1
        },
        {
          id: 5,
          text: "Which memory allocation strategy is most likely to suffer from external fragmentation?",
          options: ["Paging", "Segmentation", "Virtual Memory", "Swapping"],
          correctAnswer: 1
        }
      ]
    },
    {
      id: "net-401",
      title: "Computer Networks",
      description: "Evaluate your knowledge of network protocols, topologies, and the OSI model.",
      subject: "Computer Networks",
      duration: 30,
      questions: [
        {
          id: 1,
          text: "Which layer of the OSI model is responsible for routing?",
          options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "What protocol is used for secure web browsing?",
          options: ["HTTP", "HTTPS", "FTP", "SMTP"],
          correctAnswer: 1
        },
        {
          id: 3,
          text: "Which of the following is not a valid IP address?",
          options: ["192.168.1.1", "256.256.256.256", "10.0.0.1", "172.16.0.1"],
          correctAnswer: 1
        },
        {
          id: 4,
          text: "What is the maximum theoretical bandwidth of Gigabit Ethernet?",
          options: ["100 Mbps", "1 Gbps", "10 Gbps", "100 Gbps"],
          correctAnswer: 1
        },
        {
          id: 5,
          text: "Which protocol is used for DNS name resolution?",
          options: ["TCP only", "UDP only", "Both TCP and UDP", "Neither TCP nor UDP"],
          correctAnswer: 2
        }
      ]
    },
    {
      id: "web-501",
      title: "Web Development Fundamentals",
      description: "Test your knowledge on HTML, CSS, JavaScript, and web frameworks.",
      subject: "Web Development",
      duration: 30,
      questions: [
        {
          id: 1,
          text: "Which HTML tag is used to create a hyperlink?",
          options: ["<href>", "<link>", "<a>", "<url>"],
          correctAnswer: 2
        },
        {
          id: 2,
          text: "Which CSS property is used to change the text color?",
          options: ["text-color", "font-color", "color", "foreground-color"],
          correctAnswer: 2
        },
        {
          id: 3,
          text: "Which JavaScript method is used to add an element at the end of an array?",
          options: ["push()", "append()", "addToEnd()", "insert()"],
          correctAnswer: 0
        },
        {
          id: 4,
          text: "What does API stand for?",
          options: [
            "Application Programming Interface",
            "Application Protocol Interface",
            "Advanced Programming Interface",
            "Application Process Integration"
          ],
          correctAnswer: 0
        },
        {
          id: 5,
          text: "Which of these is not a JavaScript framework or library?",
          options: ["React", "Angular", "Django", "Vue"],
          correctAnswer: 2
        }
      ]
    }
  ];
async function seedDB() {
  await mongoose.connect("mongodb+srv://Zocket:Zocket1234%25%5E@cluster0.vt3ph.mongodb.net/final_proj", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await Quiz.deleteMany({});

  await Quiz.insertMany(quizzes);

  console.log("📦 Data seeded successfully!");
  mongoose.disconnect();
}

seedDB();
