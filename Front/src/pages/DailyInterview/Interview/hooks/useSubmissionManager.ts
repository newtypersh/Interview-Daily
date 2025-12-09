import { useState, useCallback, useEffect } from 'react';
import { useAnswerSubmission } from '../../../../react-query/mutation/DailyInterview/useAnswerSubmission';
import { handleError } from '../../../../utils/errorHandler';
import type { Question, UploadAudioResponse } from '../../../../types';

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

  const handleSubmissionSuccess = useCallback((data: UploadAudioResponse) => {
    if (data?.answer?.id) {
       setCurrentAnswerId(data.answer.id);
    }
  }, []);

  const { submitAudio, isSubmitting, error: submissionError } = useAnswerSubmission({
    interviewId,
    onSuccess: handleSubmissionSuccess,
    onError: handleError,
  });

  const submitAnswer = useCallback((currentQuestion: Question | undefined, mediaBlobUrl: string | null) => {
    if (mediaBlobUrl && currentQuestion) {
      submitAudio({ id: currentQuestion.id, mediaUrl: mediaBlobUrl });
    }
  }, [submitAudio]);

  return {
    isSubmitting,
    error: submissionError,
    submit: submitAnswer,
    currentAnswerId,
  };
};
