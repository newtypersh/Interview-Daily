import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startInterview } from '../../../apis/interview';
import type { StartInterviewResponse } from '../../../apis/interview/types';
import { handleError } from '../../../utils/errorHandler';
import type { Question } from '../../../types';

export const useInterviewQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const initialized = useRef(false);

  const { mutate, isPending: isLoading, error } = useMutation({
    mutationFn: (strategy: string) => startInterview(strategy),
    onSuccess: (data) => {
      if (data.success && data.success.interview) {
        const { interview } = data.success;
        setInterviewId(interview.id);
        
        const mappedQuestions: Question[] = interview.answers.map((answer: { id: string; questionContent: string; sequence: number }) => ({
          id: answer.id, 
          content: answer.questionContent,
          order: answer.sequence,
        })).sort((a: Question, b: Question) => a.order - b.order);

        setQuestions(mappedQuestions);
      }
    },
    onError: (err: any) => {
      handleError(err, '인터뷰를 시작하는 중 문제가 발생했습니다.');
    }
  });

  useEffect(() => {
    // Prevent double calling in Strict Mode and ensure single execution
    if (initialized.current) return;
    initialized.current = true;

    mutate('random'); // Trigger the mutation
  }, [mutate]);

  return {
    questions,
    status: {
      isLoading,
      error: error as Error | null,
      interviewId,
    }
  };
};
