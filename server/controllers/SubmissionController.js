import * as submissionService from './service';

export const saveQuizResults = async (req, res) => {
  try {
    const submissionData = req.body;
    
    if (!submissionData.quizId || !submissionData.userId || !submissionData.answers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const submission = await submissionService.saveSubmission(submissionData);
    const percentageScore = (submission.score / submission.totalQuestions) * 100;

    res.status(201).json({
      success: true,
      message: 'Quiz results saved successfully',
      quizId: submission.quizId,
      userId: submission.userId,
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      percentageScore: percentageScore.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};