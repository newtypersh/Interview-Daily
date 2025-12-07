import { useEffect, useCallback, useState } from 'react';
import { useRecording } from '../../../../hooks/useRecording';
import { useInterviewQuestions } from '../../../../react-query/mutation/DailyInterview/useInterviewQuestions';
import { useInterviewSession } from './useInterviewSession';
import { useAnswerSubmission } from '../../../../react-query/mutation/DailyInterview/useAnswerSubmission';

interface UseInterviewFlowProps {
  onComplete: () => void;
  onError: (error: Error) => void;
}

import type { InterviewContextType } from '../../../../types';

export const useInterviewFlow = ({ onComplete, onError }: UseInterviewFlowProps): InterviewContextType => {
  // 1. Core Hooks & Data
  const recording = useRecording();
  const { questions, interviewId, isLoading, error: stepsError } = useInterviewQuestions();

  // 2. Session Management
  const {
    currentIndex,
    isFirstQuestion,
    isLastQuestion,
    toNextQuestion,
    toPrevQuestion,
  } = useInterviewSession({ totalQuestions: questions.length });

  const currentQuestion = questions[currentIndex];
  const [currentAnswerId, setCurrentAnswerId] = useState<string | null>(null);

  // Clear answer ID when moving to next question
  useEffect(() => {
    setCurrentAnswerId(null);
  }, [currentIndex]);

  // 3. Orchestration Helpers
  useEffect(() => {
    recording.reset();
  }, [currentIndex]);

  // 4. Submission Logic
  const handleSubmissionSuccess = useCallback((data: any) => {
    if (data?.answer?.id) {
       setCurrentAnswerId(data.answer.id);
    }
    
    // Auto-complete only if it's the last question? 
    // Plan said: "Update submitAnswer to NOT call toNextQuestion on success." 
    // "Instead, on success, set currentAnswerId."
    if (isLastQuestion) {
      // For last question, we might still want to show STT?
      // User said "1번 방식(Polling)".
      // Let's keep it manual for now. User must click "Next" or "Complete".
      // But button says "피드백 작성하기" for last question.
    }
  }, [isLastQuestion]);

  const { submitAudio, isSubmitting, error: submissionError } = useAnswerSubmission({
    interviewId,
    onSuccess: handleSubmissionSuccess,
    onError,
  });

  const submitAnswer = useCallback(() => {
    if (recording.mediaBlobUrl && currentQuestion) {
      submitAudio({ id: currentQuestion.id, mediaUrl: recording.mediaBlobUrl });
    }
  }, [recording.mediaBlobUrl, currentQuestion, submitAudio]);

  return {
    session: {
      currentQuestion,
      currentIndex,
      totalQuestions: questions.length,
      isFirstQuestion,
      isLastQuestion,
      toNextQuestion,
      toPrevQuestion,
      completeInterview: onComplete,
    },
    recording: {
      isActive: recording.isRecording,
      isStopped: recording.recordingStopped,
      start: recording.start,
      stop: recording.stop,
      retry: recording.reset,
    },
    submission: {
      isSubmitting,
      error: submissionError,
      submit: submitAnswer,
      currentAnswerId,
    },
    status: {
      isLoading,
      error: stepsError,
      interviewId,
    }
  };
};
