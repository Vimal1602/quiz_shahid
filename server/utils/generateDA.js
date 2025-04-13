// export default function generateDA(quizResult) {
//     // Basic analysis
//     const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100);
//     let performance;
    
//     if (percentage >= 80) performance = "Excellent";
//     else if (percentage >= 60) performance = "Good";
//     else if (percentage >= 40) performance = "Average";
//     else performance = "Needs Improvement";
  
//     // Question-level analysis
//     const questionAnalysis = quizResult.answers.map(answer => {
//       return {
//         question: answer.questionText,
//         selected: answer.selectedOptionContent || "Not answered",
//         correct: answer.correctOptionContent,
//         isCorrect: answer.isCorrect,
//         explanation: answer.isCorrect 
//           ? "You answered correctly!" 
//           : `The correct answer was: ${answer.correctOptionContent}`
//       };
//     });
  
//     return {
//       summary: {
//         score: quizResult.score,
//         totalQuestions: quizResult.totalQuestions,
//         percentage,
//         performance,
//         timeSpent: `${Math.floor(quizResult.timeSpent / 60)}m ${quizResult.timeSpent % 60}s`
//       },
//       details: questionAnalysis,
//       recommendations: getRecommendations(performance)
//     };
//   }
  
//   function getRecommendations(performance) {
//     const recommendations = {
//       "Excellent": [
//         "You've mastered this material!",
//         "Consider challenging yourself with more advanced topics."
//       ],
//       "Good": [
//         "You have a solid understanding of most concepts.",
//         "Review the questions you missed to improve further."
//       ],
//       "Average": [
//         "You're on the right track but need more practice.",
//         "Focus on the areas where you made mistakes."
//       ],
//       "Needs Improvement": [
//         "Spend more time studying the material.",
//         "Consider reviewing the fundamentals again."
//       ]
//     };
    
//     return recommendations[performance];
//   }