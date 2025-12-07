import { useEffect } from 'react';
import { Paper, Stack, Box, Typography, Divider, Button, CircularProgress } from '@mui/material';
import { Replay as ReplayIcon, NavigateNext as NavigateNextIcon, Check as CheckIcon } from '@mui/icons-material';
import { useInterviewContext } from '../context/InterviewContext';
import { useTranscript } from '../../../../react-query/queries/useTranscript';

export default function AnswerReview() {
  const { session, recording, submission, status } = useInterviewContext();
  const { currentQuestion, isLastQuestion, toNextQuestion, completeInterview } = session;
  const { retry } = recording;
  const { submit, isSubmitting, currentAnswerId } = submission;
  const { interviewId } = status;

  // Auto-submit when component mounts (Review phase starts)
  useEffect(() => {
    submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Poll for transcript
  const { transcript, isTranscribing } = useTranscript({
    interviewId,
    answerId: currentAnswerId || null,
  });

  if (!currentQuestion) return null;

  const handleNext = () => {
    if (isLastQuestion) {
      completeInterview();
    } else {
      toNextQuestion();
    }
  };

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
              {isTranscribing ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    변환 중...
                  </Typography>
                </Stack>
              ) : transcript ? (
                <Typography variant="body1" color="text.primary">
                  {transcript}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                   {isSubmitting ? '답변 저장 중...' : '변환된 텍스트가 없습니다.'}
                </Typography>
              )}
            </Paper>
          </Box>
        </Stack>
      </Paper>

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
          onClick={handleNext}
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
    </>
  );
}
