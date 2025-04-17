import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


import { Quiz } from "./models/Quiz.js";
import { Assignment } from "./models/Assignment.js";
import { StudentResult } from "./models/StudentResult.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for quiz results (replace with a database in production)
const quizResults = [];

mongoose.connect('mongodb+srv://Zocket:Zocket1234%25%5E@cluster0.vt3ph.mongodb.net/final_proj', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.get("/api/quizzes", async (req, res) => {
    const quizzes = await Quiz.find();
    res.json(quizzes);
    console.log("Hello from quizzes API!");
  });

app.get("/api/assignments", async (req, res) => {
const assignments = await Assignment.find();
res.json(assignments);
console.log("Hello from Assignments API!");
});

app.get("/api/results/:studentId", async (req, res) => {
// console.log("Hello from results API!");
try {
    console.log("Hello from results API!");
    console.log(req.params.studentId);
    const results = await StudentResult.find({ user_id: req.params.studentId });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/results/", async (req, res) => {
    // console.log("Hello from results API!");
    try {
        console.log("Hello from results API!");
        console.log(req.params.studentId);
        const results = await StudentResult.find();
        res.json(results);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
      }
    });

// API route to save quiz results
import QuizResult from './models/QuizResult.js'; // Adjust path as needed
// import Assignment from '../client/src/pages/Assignment.js';
app.post('/api/save-quiz-results', async (req, res) => {
    try {
        const { userId, quizId, answers, score } = req.body;

        // Basic validation
        if (!userId || !quizId || !answers || score === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create and save a new result document
        const result = new QuizResult({
            userId,
            quizId,
            answers,
            score
        });

        await result.save();

        res.status(201).json({
            success: true,
            message: 'Quiz results saved successfully',
            result
        });
    } catch (error) {
        console.error('Error saving quiz results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Optional: Add a GET endpoint to retrieve results (for testing)
app.get('/api/quiz-results', (req, res) => {
    res.json(quizResults);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});