import { Typography, Paper } from '@mui/material';
import type { Question } from '../../../../apis/questionSet/types';

type QuestionDisplayProps = {
  currentQuestion: Question | undefined;
}

export default function QuestionDisplay({ currentQuestion }: QuestionDisplayProps) {

  // Safety check, although parent should handle it
  if (!currentQuestion) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#f5f5f5',
        p: { xs: 3, md: 4 },
        mb: 4,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#667eea',
          mb: 2,
        }}
      >
        질문
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: '#1f2937',
          fontWeight: 500,
        }}
      >
        {currentQuestion.content}
      </Typography>
    </Paper>
  );
}
