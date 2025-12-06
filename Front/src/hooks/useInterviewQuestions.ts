import { useState, useEffect } from 'react';
import type { Question } from '../types';

// Mock data moved here
const mockQuestions: Question[] = [
  { id: '1', content: '1분 자기소개 시작해주세요', order: 1 },
  { id: '2', content: '만일 1분 자기소개에서 말한 1번째 경험을 어떻게 진행했었나요?', order: 2 },
];

export const useInterviewQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setQuestions(mockQuestions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch questions'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return {
    questions,
    isLoading,
    error,
  };
};
