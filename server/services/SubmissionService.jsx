import Submission from '..//models/Submissions.jsx';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


export const saveSubmission = async (submissionData) => {
  try {
    const submission = new Submission(submissionData);
    await submission.save();
    return submission;
  } catch (error) {
    throw new Error(`Error saving submission: ${error.message}`);
  }
};

export const getSubmissionsByUser = async (userId) => {
  try {
    return await Submission.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error fetching submissions: ${error.message}`);
  }
};