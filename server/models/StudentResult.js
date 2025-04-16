import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  user_id: String,
  quizId: String,
  // score: Number,
  analysis: String
  // completedAt: Date,
  // timeSpent: Number,
});

export const StudentResult = mongoose.model("Report", resultSchema);