import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  duration: Number,
  subject: String,
  questions: Array,
});

export const Quiz = mongoose.model("Quiz", quizSchema);
