import { useCallback } from 'react';
import { useInterviewQuestions } from '../../../../react-query/mutation/DailyInterview/useInterviewQuestions';
import { useInterviewSession } from './useInterviewSession';
import { useRecordingManager } from './useRecordingManager';
import { useSubmissionManager } from './useSubmissionManager';
import type { InterviewContextType } from '../../../../types';

interface UseInterviewFlowProps {
  onComplete: (interviewId: string) => void;
  onError: (error: Error) => void;
}

export const useInterviewFlow = ({ onComplete, onError }: UseInterviewFlowProps): InterviewContextType => {
  // 1. Data Layer
  const { questions, interviewId, isLoading, error: stepsError } = useInterviewQuestions();

  // 2. Session Layer
  const session = useInterviewSession({ totalQuestions: questions.length });

  // 3. Recording Layer (Auto-resets on index change)
  const recording = useRecordingManager({ resetOnIndexChange: session.currentIndex });

  // 4. Submission Layer
  const submission = useSubmissionManager({ 
    interviewId, 
    currentIndex: session.currentIndex, 
    onError 
  });

  const currentQuestion = questions[session.currentIndex];

  const submitAnswer = useCallback(() => {
    submission.submit(currentQuestion, recording.mediaBlobUrl ?? undefined);
  }, [currentQuestion, recording.mediaBlobUrl, submission]);

  const handleComplete = useCallback(() => {
    if (interviewId) {
      onComplete(interviewId);
    }
  }, [interviewId, onComplete]);

  return {
    session: {
      ...session,
      totalQuestions: questions.length,
      currentQuestion,
      completeInterview: handleComplete,
    },
    recording: {
      isActive: recording.isActive,
      isStopped: recording.isStopped,
      start: recording.start,
      stop: recording.stop,
      retry: recording.retry,
    },
    submission: {
      isSubmitting: submission.isSubmitting,
      error: submission.error,
      submit: submitAnswer,
      currentAnswerId: submission.currentAnswerId,
    },
    status: {
      isLoading,
      error: stepsError,
      interviewId,
    }
  };
};
