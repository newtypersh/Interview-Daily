import { Box, Typography } from '@mui/material';

interface FeedbackTemplateGuideProps {
  content: string | undefined;
  category: string | undefined;
}

export default function FeedbackTemplateGuide({ content, category }: FeedbackTemplateGuideProps) {
  if (!content) return null;

  return (
    <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom color="primary">
        💡 피드백 가이드 ({category || 'General'})
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {content}
      </Typography>
    </Box>
  );
}
