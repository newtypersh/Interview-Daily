import { useState } from 'react';
import type { InterviewSession } from '../../types';

// Mock data
const mockHistory: InterviewSession[] = [
  {
    id: '1',
    date: '9/11',
    questionSetId: '1',
    questionSetName: '질문세트1',
    questionSetType: '지원동기 면접',
    answers: [
      {
        id: 'a1',
        questionId: 'q1',
        content: '저는 프론트엔드 개발자로서...',
        createdAt: '2024-09-11T10:00:00Z',
      },
    ],
    feedbacks: [
      {
        id: 'f1',
        answerId: 'a1',
        satisfaction: 'satisfied',
        content: '답변이 명확하고 구체적이었습니다.',
      },
    ],
  },
  {
    id: '2',
    date: '9/10',
    questionSetId: '1',
    questionSetName: '질문세트1',
    questionSetType: '지원동기 면접',
    answers: [
      {
        id: 'a2',
        questionId: 'q2',
        content: '팀 프로젝트에서 리더 역할을...',
        createdAt: '2024-09-10T10:00:00Z',
      },
    ],
    feedbacks: [
      {
        id: 'f2',
        answerId: 'a2',
        satisfaction: 'unsatisfied',
        content: '좀 더 구체적인 예시가 필요합니다.',
      },
    ],
  },
];

export default function History() {
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  const toggleSession = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">면접 기록</h1>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {mockHistory.map((session) => {
              const isExpanded = expandedSessions.has(session.id);

              return (
                <div
                  key={session.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Session Header */}
                  <button
                    onClick={() => toggleSession(session.id)}
                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-gray-900">
                        {session.date}
                      </span>
                      <span className="text-gray-600">{session.questionSetName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">{session.questionSetType}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-6 space-y-6">
                      {session.answers.map((answer, index) => {
                        const feedback = session.feedbacks.find(
                          (f) => f.answerId === answer.id
                        );

                        return (
                          <div
                            key={answer.id}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                          >
                            {/* Left Side - Question & Answer */}
                            <div className="space-y-4">
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    질문
                                  </span>
                                  <span className="px-2 py-1 bg-gray-200 rounded text-xs font-medium text-gray-700">
                                    재생버튼
                                  </span>
                                </div>
                                <p className="text-gray-700">
                                  질문 내용이 여기에 표시됩니다
                                </p>
                              </div>

                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    답변
                                  </span>
                                </div>
                                <p className="text-gray-700">{answer.content}</p>
                              </div>
                            </div>

                            {/* Right Side - Feedback */}
                            <div className="bg-gray-50 rounded-lg p-4 h-full">
                              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                피드백
                              </h3>
                              {feedback && (
                                <div className="space-y-3">
                                  <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={feedback.satisfaction === 'satisfied'}
                                        readOnly
                                        className="w-4 h-4 text-yellow-400 rounded"
                                      />
                                      <span className="text-sm text-gray-700">만족</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={feedback.satisfaction === 'unsatisfied'}
                                        readOnly
                                        className="w-4 h-4 text-yellow-400 rounded"
                                      />
                                      <span className="text-sm text-gray-700">대답</span>
                                    </label>
                                  </div>
                                  <p className="text-gray-700 text-sm">
                                    {feedback.content}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {mockHistory.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">아직 면접 기록이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
