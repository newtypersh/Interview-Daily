import { Box, Container, Paper } from '@mui/material';
import InterviewNavigation from './InterviewNavigation';
import QuestionDisplay from './QuestionDisplay';
import InterviewActionArea from './InterviewActionArea';
import type { Question, InterviewStatus, InterviewRecording, InterviewSubmission, InterviewSessionState } from '../../../../types';

// Extended Session Type for Props
export interface DailyInterviewLayoutProps {
  session: InterviewSessionState & {
    totalQuestions: number;
    currentQuestion: Question;
  };
  recording: InterviewRecording;
  submission: InterviewSubmission;
  status: InterviewStatus;
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
