import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react'; // Assuming you're using lucide-react icons

const FollowUpQuiz = () => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [questions] = useState([
    {
      id: 1,
      question: 'What is React?',
      options: [
        'A JavaScript library',
        'A programming language',
        'A database',
        'An operating system'
      ],
      correctAnswer: 0
    },
    // Add more questions here
  ]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Timer */}
      <div className="flex items-center justify-end mb-6">
        <div className={`quiz-timer ${timeLeft < 300 ? "text-amber-600" : ""} flex items-center`}>
          <Clock className="h-5 w-5 mr-2" />
          Time Remaining: {formatTime(timeLeft)}
        </div>
      </div>

      {/* Quiz Content */}
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
            <div className="space-y-2">
              {q.options.map((option, index) => (
                <label key={index} className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={index}
                    className="mr-3"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button className="px-4 py-2 bg-gray-200 rounded">Previous</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
      </div>
    </div>
  );
};

export default FollowUpQuiz;