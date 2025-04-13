import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userDetails: {
    name: String,
    email: {
      type: String,
      required: true
    }
  },
  answers: {
    type: [Number],
    required: true
  },
  selectedOptions: [{
    questionId: String,
    selectedOption: Number,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Submission', submissionSchema);