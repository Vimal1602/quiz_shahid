import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  dueDate: Date,
  subject: String,
});

export const Assignment = mongoose.model("Assignment", assignmentSchema);
