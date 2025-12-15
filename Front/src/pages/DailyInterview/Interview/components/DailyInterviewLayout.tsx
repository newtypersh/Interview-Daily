import { Box, Container, Paper } from '@mui/material';
import InterviewNavigation from './InterviewNavigation';
import QuestionDisplay from './QuestionDisplay';
import InterviewActionArea from './InterviewActionArea';
import type { Question } from '../../../../apis/questionSet/types';
import type { InterviewLoadingStatus, InterviewRecording, InterviewSubmission, InterviewSessionState } from '../../../../apis/interview/types';

// Extended Session Type for Props
type DailyInterviewLayoutProps = {
  session: InterviewSessionState & {
    totalQuestions: number;
    currentQuestion: Question;
  };
  recording: InterviewRecording;
  submission: InterviewSubmission;
  status: InterviewLoadingStatus;
  onComplete: (interviewId: string) => void;
}

export default function DailyInterviewLayout({ 
  session, 
  recording, 
  submission, 
  status,
  onComplete 
}: DailyInterviewLayoutProps) {
  const { currentQuestion } = session;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 3,
          }}
        >
          <InterviewNavigation session={session} />

          <QuestionDisplay currentQuestion={currentQuestion} />

          <InterviewActionArea 
            session={session}
            recording={recording}
            submission={submission}
            status={status}
            onComplete={onComplete}
          />
        </Paper>
      </Container>
    </Box>
  );
}
