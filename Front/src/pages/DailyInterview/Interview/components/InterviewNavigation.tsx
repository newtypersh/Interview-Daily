import { Stack, LinearProgress, Typography, Box, IconButton } from '@mui/material';
import { NavigateNext, NavigateBefore } from '@mui/icons-material';
import type { InterviewSessionState } from '../../../../types';

interface InterviewNavigationProps {
  session: InterviewSessionState;
}

export default function InterviewNavigation({ session }: InterviewNavigationProps) {
  const { currentIndex, totalQuestions, isFirstQuestion, isLastQuestion, toPrevQuestion, toNextQuestion } = session;

  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <IconButton 
          onClick={toPrevQuestion}
          disabled={isFirstQuestion}
          size="small"
        >
          <NavigateBefore />
        </IconButton>
        
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          질문 {currentIndex + 1} / {totalQuestions}
        </Typography>

        <IconButton 
          onClick={toNextQuestion}
          disabled={isLastQuestion}
          size="small"
        >
          <NavigateNext />
        </IconButton>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: '#edf2f7',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          },
        }}
      />
    </Box>
  );
}
