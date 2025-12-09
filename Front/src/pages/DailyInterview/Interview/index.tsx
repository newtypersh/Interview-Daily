import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper } from '@mui/material';
import InterviewNavigation from './components/InterviewNavigation';
import QuestionDisplay from './components/QuestionDisplay';
import InterviewActionArea from './components/InterviewActionArea';
import { useInterviewQuestions } from '../../../react-query/mutation/DailyInterview/useInterviewQuestions';
import { useInterviewSession } from './hooks/useInterviewSession';
import { useRecordingManager } from './hooks/useRecordingManager';
import { useSubmissionManager } from './hooks/useSubmissionManager';
import { useInterviewCompletion } from '../../../react-query/mutation/DailyInterview/useInterviewCompletion';
import { handleError } from '../../../utils/errorHandler';

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

  const submitAnswer = useCallback(() => {
    submission.submit(currentQuestion, recording.mediaBlobUrl ?? null);
  }, [currentQuestion, recording.mediaBlobUrl, submission]);

  const handleComplete = useCallback(() => {
    if (interviewId) {
      complete(interviewId);
    }
  }, [interviewId, complete]);

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

  // Construct props for components
  const sessionProps = {
    ...session,
    totalQuestions: questions.length,
    currentQuestion,
    completeInterview: handleComplete,
  };

  const recordingProps = {
    isActive: recording.isActive,
    isStopped: recording.isStopped,
    start: recording.start,
    stop: recording.stop,
    retry: recording.retry,
  };

  const submissionProps = {
    isSubmitting: submission.isSubmitting,
    error: submission.error,
    submit: submitAnswer,
    currentAnswerId: submission.currentAnswerId,
  };

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
          <InterviewNavigation session={sessionProps} />

          <QuestionDisplay currentQuestion={currentQuestion} />

          <InterviewActionArea 
            session={sessionProps}
            recording={recordingProps}
            submission={submissionProps}
            status={status}
          />
        </Paper>
      </Container>
    </Box>
  );
}
