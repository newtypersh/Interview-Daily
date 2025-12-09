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
  const session = useInterviewSession({ questions });
  
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
  if (!session.currentQuestion) {
    return null; // Or a loading spinner handled here
  }

  return (
    <DailyInterviewLayout
      session={session}
      recording={recording}
      submission={submission}
      status={status}
      onComplete={complete}
    />
  );
}
