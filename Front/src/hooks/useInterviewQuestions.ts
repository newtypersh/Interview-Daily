import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startInterview } from '../apis/interview';
import type { Question } from '../types';

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
        
        const mappedQuestions: Question[] = interview.answers.map((answer) => ({
          id: answer.id, 
          content: answer.questionContent,
          order: answer.sequence,
        })).sort((a, b) => a.order - b.order);

        setQuestions(mappedQuestions);
      }
    },
    onError: (err: any) => {
      console.error('Failed to start interview:', err);
      // Logic for 409 Conflict can be added here
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
    interviewId,
    isLoading,
    error: error as Error | null,
  };
};
