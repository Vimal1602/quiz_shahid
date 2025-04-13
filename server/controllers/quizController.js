import QuizResult from '../models/QuizResult.js';

// Simple sleep function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const saveQuizResults = async (req, res) => {
  try {
    console.log('Received quiz results:', req.body);

    // Simulate processing delay of 10 seconds
    await sleep(10000); // 10000ms = 10 seconds

    const daContent = "This is dummy DA content for testing";

    res.status(201).json({
      success: true,
      data: "success",
      daContent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
