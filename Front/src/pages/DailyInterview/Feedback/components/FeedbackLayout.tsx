import { Box, Container, Paper, Button, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { type Control } from 'react-hook-form';
import type { FeedbackFormValues } from '../schemas/form';
import FeedbackHeader from './FeedbackHeader';
import FeedbackTemplateGuide from './FeedbackTemplateGuide';
import FeedbackList from './FeedbackList';
import type { FeedbackItem } from '../utils/feedbackMapper';

type FeedbackLayoutProps = {
  feedbackItems: FeedbackItem[];
  control: Control<FeedbackFormValues>;
  templateContent?: string;
  category?: string;
  playingAudio: string | null;
  isSubmitting: boolean;
  onPlayAudio: (url: string) => void;
  onSubmit: () => void;
}

export default function FeedbackLayout({
  feedbackItems,
  control,
  templateContent,
  category,
  playingAudio,
  isSubmitting,
  onPlayAudio,
  onSubmit,
}: FeedbackLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', py: 6 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
          <FeedbackHeader />
          <FeedbackTemplateGuide content={templateContent} category={category} />

          <Box sx={{ mb: 6 }}>
            <FeedbackList
              feedbackItems={feedbackItems}
              control={control}
              playingAudio={playingAudio}
              onPlayAudio={onPlayAudio}
            />
          </Box>

          <Box sx={{ mt: 6 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              onClick={onSubmit}
              disabled={isSubmitting}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 2,
                fontSize: '1.125rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                },
              }}
            >
              피드백 제출 완료
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
