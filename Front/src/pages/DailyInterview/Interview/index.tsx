import { useNavigate } from 'react-router-dom';
import { useInterviewQuestions } from '../../../react-query/mutation/DailyInterview/useInterviewQuestions';
import { useInterviewSession } from './hooks/useInterviewSession';
import { useRecordingManager } from './hooks/useRecordingManager';
import { useSubmissionManager } from './hooks/useSubmissionManager';
import { useInterviewCompletion } from '../../../react-query/mutation/DailyInterview/useInterviewCompletion';
import { handleError } from '../../../utils/errorHandler';
import DailyInterviewLayout from './components/DailyInterviewLayout';

export default function DailyInterview() {
  const navigate = useNavigate();

  // 1. Data Layer
  const { questions, interviewId, isLoading, error: stepsError } = useInterviewQuestions();

  // 2. Completion Logic
  const { complete } = useInterviewCompletion({
    onSuccess: (_: unknown, completedInterviewId: string) => {
      navigate('/daily-interview/feedback', {
        state: { interviewId: completedInterviewId }
      });
    },
    onError: handleError,
  });

  // 3. Session Layer
  const session = useInterviewSession({ totalQuestions: questions.length });
  const currentQuestion = questions[session.currentIndex];

  // 4. Recording Layer (Auto-resets on index change)
  const recording = useRecordingManager({ resetOnIndexChange: session.currentIndex });

  // 5. Submission Layer
  const submission = useSubmissionManager({ 
    interviewId, 
    currentIndex: session.currentIndex, 
    onError: handleError
  });

  // Construct status object
  const status = {
    isLoading,
    error: stepsError,
    interviewId,
  };

  // Safety check for currentQuestion (it might be undefined during loading/empty state)
  if (!currentQuestion) {
    return null; // Or a loading spinner handled here
  }

  // Construct props for Layout
  const sessionProps = {
    ...session,
    totalQuestions: questions.length,
    currentQuestion,
  };

  const recordingProps = {
    isActive: recording.isActive,
    isStopped: recording.isStopped,
    start: recording.start,
    stop: recording.stop,
    retry: recording.retry,
    mediaBlobUrl: recording.mediaBlobUrl ?? null,
  };

  const submissionProps = {
    isSubmitting: submission.isSubmitting,
    error: submission.error,
    submit: submission.submit,
    currentAnswerId: submission.currentAnswerId,
  };

  return (
    <DailyInterviewLayout
      session={sessionProps}
      recording={recordingProps}
      submission={submissionProps}
      status={status}
      onComplete={complete}
    />
  );
}
