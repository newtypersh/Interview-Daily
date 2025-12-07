import { Typography, Paper } from '@mui/material';
import { useInterviewContext } from '../context/InterviewContext';

export default function QuestionDisplay() {
  const { session } = useInterviewContext();
  const { currentQuestion } = session;

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
