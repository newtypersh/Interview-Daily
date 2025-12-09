import { useState, useEffect } from 'react';
import { useAnswerSubmission } from '../../../../react-query/mutation/DailyInterview/useAnswerSubmission';
import { handleError } from '../../../../utils/errorHandler';

interface UseSubmissionManagerProps {
  interviewId: string | null;
  currentIndex: number;
}

export const useSubmissionManager = ({ interviewId, currentIndex }: UseSubmissionManagerProps) => {
  const [currentAnswerId, setCurrentAnswerId] = useState<string | null>(null);

  // Clear answer ID when moving to next question
  useEffect(() => {
    setCurrentAnswerId(null);
  }, [currentIndex]);

  const { submit, isSubmitting, error: submissionError } = useAnswerSubmission({
    interviewId,
    onSuccess: (data) => {
      if (data?.answer?.id) {
         setCurrentAnswerId(data.answer.id);
      }
    },
    onError: (error) => handleError(error),
  });

  return {
    isSubmitting,
    error: submissionError,
    submit,
    currentAnswerId,
  };
};
