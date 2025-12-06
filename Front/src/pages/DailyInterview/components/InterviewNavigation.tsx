import { Box, IconButton, Chip } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

interface InterviewNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function InterviewNavigation({
  currentIndex,
  totalQuestions,
  isFirstQuestion,
  isLastQuestion,
  onPrev,
  onNext,
}: InterviewNavigationProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, gap: 2 }}>
      <IconButton
        onClick={onPrev}
        disabled={isFirstQuestion}
        sx={{
          color: '#667eea',
          '&:disabled': {
            color: 'rgba(0, 0, 0, 0.26)',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Chip
        label={`질문 ${currentIndex + 1} / ${totalQuestions}`}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600,
        }}
      />
      <IconButton
        onClick={onNext}
        disabled={isLastQuestion}
        sx={{
          color: '#667eea',
          '&:disabled': {
            color: 'rgba(0, 0, 0, 0.26)',
          },
        }}
      >
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
}
