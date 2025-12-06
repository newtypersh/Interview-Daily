import { Box, Container, Paper, Stack } from '@mui/material';
import InterviewNavigation from './components/InterviewNavigation';
import QuestionDisplay from './components/QuestionDisplay';
import RecordingSection from './components/RecordingSection';
import AnswerReview from './components/AnswerReview';
import { InterviewProvider, useInterviewContext } from './context/InterviewContext';

// Inner component to consume context
function InterviewContent() {
  const {
    currentQuestion,
    recordingStopped,
  } = useInterviewContext();

  // Safety check for currentQuestion (it might be undefined during loading/empty state)
  if (!currentQuestion) {
    return null; // Or a loading spinner handled inside context/components
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
          <InterviewNavigation />

          <QuestionDisplay />

          <Stack spacing={3}>
            {!recordingStopped ? (
              <RecordingSection />
            ) : (
              <AnswerReview />
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default function DailyInterview() {
  return (
    <InterviewProvider>
      <InterviewContent />
    </InterviewProvider>
  );
}
