import { Paper, Stack, Box, Typography, Divider, Button } from '@mui/material';
import { Replay as ReplayIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useInterviewContext } from '../context/InterviewContext';

export default function AnswerReview() {
  const { currentQuestion, isLastQuestion, retryRecording, submitAnswer, isSubmitting } = useInterviewContext();

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
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              답변
            </Typography>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'white',
                p: 2,
                minHeight: 100,
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                녹음된 답변이 여기에 표시됩니다...
              </Typography>
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
          onClick={retryRecording}
          disabled={isSubmitting}
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
          endIcon={!isLastQuestion && <NavigateNextIcon />}
          onClick={() => submitAnswer()}
          disabled={isSubmitting}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
            },
          }}
        >
          {isSubmitting ? '저장 중...' : (isLastQuestion ? '피드백 작성하기' : '다음 질문')}
        </Button>
      </Stack>
    </>
  );
}
