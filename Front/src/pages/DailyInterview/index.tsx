import { Box, Container, Paper, Stack } from '@mui/material';
import { useDailyInterview } from '../../hooks/useDailyInterview';
import InterviewNavigation from './components/InterviewNavigation';
import QuestionDisplay from './components/QuestionDisplay';
import RecordingSection from './components/RecordingSection';
import AnswerReview from './components/AnswerReview';

export default function DailyInterview() {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isRecording,
    recordingStopped,
    isLastQuestion,
    isFirstQuestion,
    handleStartRecording,
    handleStopRecording,
    handleRetry,
    handlePrevQuestion,
    handleNextQuestion,
    handleSubmit,
  } = useDailyInterview();

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
          <InterviewNavigation
            currentIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            onPrev={handlePrevQuestion}
            onNext={handleNextQuestion}
          />

          <QuestionDisplay content={currentQuestion.content} />

          <Stack spacing={3}>
            {!recordingStopped ? (
              <RecordingSection
                isRecording={isRecording}
                onStart={handleStartRecording}
                onStop={handleStopRecording}
              />
            ) : (
              <AnswerReview
                questionContent={currentQuestion.content}
                isLastQuestion={isLastQuestion}
                onRetry={handleRetry}
                onSubmit={handleSubmit}
              />
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
