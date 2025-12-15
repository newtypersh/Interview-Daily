import { Box, Typography } from '@mui/material';
import MarkdownPreview from '../../../../components/MarkdownPreview';

type FeedbackTemplateGuideProps = {
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
      <MarkdownPreview 
        content={content} 
        sx={{ 
          border: 'none', 
          bgcolor: 'transparent', 
          p: 0, 
          height: 'auto',
          'div.markdown-preview': {
            whiteSpace: 'pre-wrap' // Preserve existing whitespace behavior if needed, or let markdown handle it
          }
        }} 
      />
    </Box>
  );
}
