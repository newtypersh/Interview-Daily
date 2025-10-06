import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '../../types';

// Mock data for demonstration
const mockQuestions: Question[] = [
  { id: '1', content: '1분 자기소개 시작해주세요', order: 1 },
  { id: '2', content: '만일 1분 자기소개에서 말한 1번째 경험을 어떻게 진행했었나요?', order: 2 },
];

export default function DailyInterview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === mockQuestions.length - 1;

  const handleStartRecording = () => {
    setIsRecording(true);
    // TODO: Implement actual recording logic
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // TODO: Save recording
  };

  const handleRetry = () => {
    setIsRecording(false);
    // TODO: Reset recording
  };

  const handleSubmit = () => {
    // Save current answer
    setAnswers({ ...answers, [currentQuestion.id]: 'Recorded answer' });

    if (isLastQuestion) {
      // Navigate to feedback page
      navigate('/daily-interview/feedback');
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Question Counter */}
          <div className="text-center mb-8">
            <span className="text-sm font-medium text-gray-500">
              질문 {currentQuestionIndex + 1} / {mockQuestions.length}
            </span>
          </div>

          {/* Question */}
          <div className="mb-12">
            <div className="bg-gray-100 rounded-xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                질문
              </h2>
              <p className="text-lg md:text-xl text-gray-800 mt-4">
                {currentQuestion.content}
              </p>
            </div>
          </div>

          {/* Recording Section */}
          <div className="space-y-6">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 rounded-lg transition-colors text-lg"
              >
                녹음 시작
              </button>
            ) : (
              <>
                {/* Recording Indicator */}
                <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 flex items-center justify-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-700 font-semibold text-lg">녹음 중...</span>
                </div>

                {/* Answer Section */}
                <div className="bg-gray-50 rounded-xl p-6 md:p-8 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">질문</h3>
                    <p className="text-gray-700">{currentQuestion.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">답변</h3>
                    <div className="bg-white rounded-lg p-4 min-h-[100px]">
                      <p className="text-gray-500 italic">녹음된 답변이 여기에 표시됩니다...</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleRetry}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
                  >
                    다시 녹음하기
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
                  >
                    {isLastQuestion ? '피드백 작성하기' : '다음 질문'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
