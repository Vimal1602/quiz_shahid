import express from 'express';
import { saveQuizResults } from '../controllers/quizController.js';

const router = express.Router();

router.post('/save-quiz-results', saveQuizResults);



export default router;