import { useEffect } from 'react';
import { Paper, Stack, Box, Typography, Divider, Button, CircularProgress } from '@mui/material';
import { Replay as ReplayIcon, NavigateNext as NavigateNextIcon, Check as CheckIcon } from '@mui/icons-material';
import { useTranscript } from '../../../../react-query/queries/useTranscript';
import type { InterviewSessionState, InterviewRecording, InterviewSubmission, InterviewLoadingStatus } from '../../../../apis/interview/types';

type AnswerReviewProps = {
  session: InterviewSessionState;
  recording: InterviewRecording;
  submission: InterviewSubmission;
  status: InterviewLoadingStatus;
  onComplete: (interviewId: string) => void;
}

export default function AnswerReview({ session, recording, submission, status, onComplete }: AnswerReviewProps) {
  const { currentQuestion, isLastQuestion, toNextQuestion } = session;
  const { retry, mediaBlobUrl } = recording; // Added mediaBlobUrl extraction
  const { submit, isSubmitting, currentAnswerId } = submission;
  const { interviewId } = status;

  // Auto-submit when component mounts (Review phase starts)
  useEffect(() => {
    submit(currentQuestion?.id, mediaBlobUrl ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Poll for transcript
  const { transcript, isTranscribing } = useTranscript({
    interviewId,
    answerId: currentAnswerId || null,
  });

  if (!currentQuestion) return null;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#f9fafb',
          p: 3,
          borderRadius: 2,
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              질문
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentQuestion.content}
            </Typography>
          </Box>
          <Divider />
          <ReviewTranscript
            isTranscribing={isTranscribing}
            transcript={transcript}
            isSubmitting={isSubmitting}
          />
        </Stack>
      </Paper>

      <ReviewActions
        retry={retry}
        isSubmitting={isSubmitting}
        isLastQuestion={isLastQuestion}
        onNext={() => isLastQuestion && interviewId ? onComplete(interviewId) : toNextQuestion()}
      />
    </>
  );
}

// --- Sub Components ---

interface ReviewTranscriptProps {
  isTranscribing: boolean;
  transcript: string | null | undefined;
  isSubmitting: boolean;
}

function ReviewTranscript({ isTranscribing, transcript, isSubmitting }: ReviewTranscriptProps) {
  const renderContent = () => {
    if (isTranscribing) {
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            변환 중...
          </Typography>
        </Stack>
      );
    }

    if (transcript) {
      return (
        <Typography variant="body1" color="text.primary">
          {transcript}
        </Typography>
      );
    }

    return (
      <Typography variant="body2" color="text.secondary" fontStyle="italic">
        {isSubmitting ? '답변 저장 중...' : '변환된 텍스트가 없습니다.'}
      </Typography>
    );
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        답변 (STT 변환 결과)
      </Typography>
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'white',
          p: 2,
          minHeight: 100,
          borderRadius: 1,
          display: 'flex',
          alignItems: isTranscribing ? 'center' : 'flex-start',
          justifyContent: isTranscribing ? 'center' : 'flex-start',
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
}

interface ReviewActionsProps {
  retry: () => void;
  isSubmitting: boolean;
  isLastQuestion: boolean;
  onNext: () => void;
}

function ReviewActions({ retry, isSubmitting, isLastQuestion, onNext }: ReviewActionsProps) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <Button
        fullWidth
        variant="outlined"
        size="large"
        startIcon={<ReplayIcon />}
        onClick={retry}
        disabled={isSubmitting} // Disable retry while submitting to avoid confusion
        sx={{
          borderColor: '#667eea',
          color: '#667eea',
          fontWeight: 600,
          '&:hover': {
            borderColor: '#667eea',
            bgcolor: 'rgba(102, 126, 234, 0.04)',
          },
        }}
      >
        다시 녹음하기
      </Button>
      <Button
        fullWidth
        variant="contained"
        size="large"
        endIcon={!isLastQuestion ? <NavigateNextIcon /> : <CheckIcon />}
        onClick={onNext}
        disabled={isSubmitting} // Can navigate only after submission is done (answerId received)
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontWeight: 600,
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
          },
        }}
      >
        {isLastQuestion ? '피드백 작성하기' : '다음 질문'}
      </Button>
    </Stack>
  );
}
