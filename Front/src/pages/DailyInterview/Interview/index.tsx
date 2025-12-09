import { useInterviewQuestions } from '../../../react-query/mutation/DailyInterview/useInterviewQuestions';
import { useInterviewSession } from './hooks/useInterviewSession';
import { useRecordingManager } from './hooks/useRecordingManager';
import { useSubmissionManager } from './hooks/useSubmissionManager';
import { useInterviewFinisher } from './hooks/useInterviewFinisher';
import DailyInterviewLayout from './components/DailyInterviewLayout';

export default function DailyInterview() {
  // 1. Data Layer
  const { questions, status } = useInterviewQuestions();

  // 2. Completion Logic
  const { complete } = useInterviewFinisher();

  // 3. Session Layer
  const session = useInterviewSession({ questions });
  
  // 4. Recording Layer (Auto-resets on index change)
  const recording = useRecordingManager({ resetOnIndexChange: session.currentIndex });

  // 5. Submission Layer
  const submission = useSubmissionManager({ 
    interviewId: status.interviewId, 
    currentIndex: session.currentIndex 
  });

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
