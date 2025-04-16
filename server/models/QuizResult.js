// models/QuizResult.js
import mongoose from 'mongoose';

const QuizResultSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    quizId: { type: String, required: true },
    answers: { type: Array, required: true },
    score: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const QuizResult = mongoose.model('QuizResult', QuizResultSchema);

export default QuizResult;
