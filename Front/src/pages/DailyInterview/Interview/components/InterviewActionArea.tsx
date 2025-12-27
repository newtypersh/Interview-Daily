
import { Stack } from '@mui/material';
import RecordingSection from './RecordingSection';
import AnswerReview from './AnswerReview';
import type { InterviewSessionState, InterviewRecording, InterviewSubmission, InterviewLoadingStatus } from '../types';

type InterviewActionAreaProps = {
  session: InterviewSessionState;
  recording: InterviewRecording;
  submission: InterviewSubmission;
  status: InterviewLoadingStatus;
  onComplete: (interviewId: string) => void;
}

export default function InterviewActionArea({ session, recording, submission, status, onComplete }: InterviewActionAreaProps) {
  const { isStopped } = recording;

  return (
    <Stack spacing={3}>
      {!isStopped ? (
        <RecordingSection recording={recording} />
      ) : (
        <AnswerReview 
          session={session}
          recording={recording} 
          submission={submission}
          status={status}
          onComplete={onComplete}
        />
      )}
    </Stack>
  );
}
