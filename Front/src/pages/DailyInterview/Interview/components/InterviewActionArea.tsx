
import { Stack } from '@mui/material';
import RecordingSection from './RecordingSection';
import AnswerReview from './AnswerReview';
import type { InterviewSessionState, InterviewRecording, InterviewSubmission, InterviewStatus } from '../../../../types';

interface InterviewActionAreaProps {
  session: InterviewSessionState;
  recording: InterviewRecording;
  submission: InterviewSubmission;
  status: InterviewStatus;
}

export default function InterviewActionArea({ session, recording, submission, status }: InterviewActionAreaProps) {
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
        />
      )}
    </Stack>
  );
}
