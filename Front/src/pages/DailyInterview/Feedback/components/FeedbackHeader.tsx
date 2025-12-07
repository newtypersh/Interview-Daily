import { Box, Typography } from '@mui/material';

export default function FeedbackHeader() {
  return (
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}
      >
        피드백 작성
      </Typography>
      <Typography variant="body1" color="text.secondary">
        각 질문에 대한 답변을 평가하고 피드백을 작성해주세요
      </Typography>
    </Box>
  );
}
