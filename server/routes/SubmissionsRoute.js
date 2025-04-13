import { Router } from 'express';
import { saveQuizResults } from './controller';

const router = Router();

router.post('/save-quiz-results', saveQuizResults);

export default router;