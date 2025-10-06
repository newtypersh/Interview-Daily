import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../../types';

// Mock data
const mockQuestions: Question[] = [
  { id: '1', content: '1분 자기소개 시작해주세요', order: 1 },
  { id: '2', content: '만일 1분 자기소개에서 말한 1번째 경험을 어떻게 진행했었나요?', order: 2 },
];

type SatisfactionType = 'satisfied' | 'unsatisfied' | null;

interface QuestionFeedback {
  satisfaction: SatisfactionType;
  content: string;
}

export default function Feedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Record<string, QuestionFeedback>>(
    mockQuestions.reduce((acc, q) => ({
      ...acc,
      [q.id]: { satisfaction: null, content: '' }
    }), {})
  );

  const handleSatisfactionChange = (questionId: string, satisfaction: SatisfactionType) => {
    setFeedbacks({
      ...feedbacks,
      [questionId]: { ...feedbacks[questionId], satisfaction }
    });
  };

  const handleContentChange = (questionId: string, content: string) => {
    setFeedbacks({
      ...feedbacks,
      [questionId]: { ...feedbacks[questionId], content }
    });
  };

  const handleSubmit = () => {
    // TODO: Save feedbacks to backend
    console.log('Feedbacks:', feedbacks);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              피드백 작성
            </h1>
            <p className="text-gray-600">
              각 질문에 대한 답변을 평가하고 피드백을 작성해주세요
            </p>
          </div>

          {/* Feedback Forms */}
          <div className="space-y-8">
            {mockQuestions.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-xl p-6 md:p-8 space-y-6"
              >
                {/* Question */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      질문 {index + 1}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {question.content}
                  </p>
                </div>

                {/* Satisfaction Checkboxes */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">만족도</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feedbacks[question.id].satisfaction === 'satisfied'}
                        onChange={() => handleSatisfactionChange(
                          question.id,
                          feedbacks[question.id].satisfaction === 'satisfied' ? null : 'satisfied'
                        )}
                        className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400"
                      />
                      <span className="text-gray-700">만족</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feedbacks[question.id].satisfaction === 'unsatisfied'}
                        onChange={() => handleSatisfactionChange(
                          question.id,
                          feedbacks[question.id].satisfaction === 'unsatisfied' ? null : 'unsatisfied'
                        )}
                        className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400"
                      />
                      <span className="text-gray-700">대답</span>
                    </label>
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">피드백</h3>
                  <textarea
                    value={feedbacks[question.id].content}
                    onChange={(e) => handleContentChange(question.id, e.target.value)}
                    placeholder="이 답변에 대한 피드백을 작성해주세요..."
                    className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
            >
              피드백 제출 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
