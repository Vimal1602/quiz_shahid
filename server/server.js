import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import quizRoutes from './routes/quizRoutes.js'; // Import your quiz routes

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/', quizRoutes);
// In-memory storage for quiz results (replace with a database in production)
const quizResults = [];

// API route to save quiz results

// app.post('/api/save-quiz-results', (req, res) => {
//     try {
//         const { userId, quizId, answers, score } = req.body;
//         console.log('Received quiz results:', req.body);
//         // Validate input   
//         // Basic validation
//         if (!userId || !quizId || !answers || score === undefined) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Create a new result object
//         const result = {
//             userId,
//             quizId,
//             answers,
//             score,
//             timestamp: new Date().toISOString()
//         };
        
//             // Save to memory (replace with database operation)
//         quizResults.push(result);

//         // Send success response
//         res.status(201).json({ 
//             success: true, 
//             message: 'Quiz results saved successfully',
//             result
//         });
//     } catch (error) {
//         console.error('Error saving quiz results:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Optional: Add a GET endpoint to retrieve results (for testing)
app.get('/api/quiz-results', (req, res) => {
    res.json(quizRoutes);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});