import { useEffect, useCallback } from 'react';
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

  // 3. Orchestration Helpers
  useEffect(() => {
    recording.reset();
  }, [currentIndex]);

  // 4. Submission Logic
  const handleSubmissionSuccess = useCallback(() => {
    if (isLastQuestion) {
      onComplete();
    } else {
      toNextQuestion();
    }
  }, [isLastQuestion, onComplete, toNextQuestion]);

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
    },
    status: {
      isLoading,
      error: stepsError,
      interviewId,
    }
  };
};
