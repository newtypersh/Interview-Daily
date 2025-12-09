import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewQuestions } from '../../../../react-query/mutation/DailyInterview/useInterviewQuestions';
import { useInterviewSession } from './useInterviewSession';
import { useRecordingManager } from './useRecordingManager';
import { useSubmissionManager } from './useSubmissionManager';
import { useInterviewCompletion } from '../../../../react-query/mutation/DailyInterview/useInterviewCompletion';
import { handleError } from '../../../../utils/errorHandler';
import type { InterviewContextType } from '../../../../types';

export const useInterviewFlow = (): InterviewContextType => {
  const navigate = useNavigate();

  // 1. Completion Logic (Moved from index.tsx)
  const { complete } = useInterviewCompletion({
    onSuccess: (_, interviewId) => {
      navigate('/daily-interview/feedback', {
        state: { interviewId }
      });
    },
    onError: handleError,
  });

  // 2. Data Layer
  const { questions, interviewId, isLoading, error: stepsError } = useInterviewQuestions();

  // 3. Session Layer
  const session = useInterviewSession({ totalQuestions: questions.length });

  // 4. Recording Layer (Auto-resets on index change)
  const recording = useRecordingManager({ resetOnIndexChange: session.currentIndex });

  // 5. Submission Layer
  const submission = useSubmissionManager({ 
    interviewId, 
    currentIndex: session.currentIndex, 
    onError: handleError
  });

  const currentQuestion = questions[session.currentIndex];

  const submitAnswer = useCallback(() => {
    submission.submit(currentQuestion, recording.mediaBlobUrl ?? undefined);
  }, [currentQuestion, recording.mediaBlobUrl, submission]);

  const handleComplete = useCallback(() => {
    if (interviewId) {
      complete(interviewId);
    }
  }, [interviewId, complete]);

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
