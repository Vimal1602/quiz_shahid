import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  userId: { type: String, required: true },
  userDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  answers: [{
    questionId: String,
    questionText: String,
    selectedOptionIndex: Number,
    selectedOptionContent: String,
    correctOptionIndex: Number,
    correctOptionContent: String,
    isCorrect: Boolean,
    options: [{
      index: Number,
      content: String,
      isCorrect: Boolean,
      isSelected: Boolean
    }]
  }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeSpent: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('QuizResult', quizResultSchema);