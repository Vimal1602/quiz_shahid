import express from 'express';
import { daAnalysis, saveQuizResults } from '../controllers/quizController.js';

const router = express.Router();

router.post('/save-quiz-results', saveQuizResults);
router.post('/da-analysis', daAnalysis);



export default router;