import { Box, Container, Paper } from '@mui/material';
import InterviewNavigation from './components/InterviewNavigation';
import QuestionDisplay from './components/QuestionDisplay';
import InterviewActionArea from './components/InterviewActionArea';
import { useInterviewFlow } from './hooks/useInterviewFlow';

export default function DailyInterview() {
  const { session, recording, submission, status } = useInterviewFlow();

  const { currentQuestion } = session;

  // Safety check for currentQuestion (it might be undefined during loading/empty state)
  if (!currentQuestion) {
    return null; // Or a loading spinner handled here
  }

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
          />
        </Paper>
      </Container>
    </Box>
  );
}
