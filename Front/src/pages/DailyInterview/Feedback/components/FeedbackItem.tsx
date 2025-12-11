import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  TextField,
  Divider,
  Rating,
  IconButton,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import type { Question, QuestionFeedback } from '../hooks/useFeedbackForm';
import ContentBox from '../../../../components/ContentBox';

interface FeedbackItemProps {
  question: Question;
  index: number;
  answer: string;
  feedback: QuestionFeedback;
  isPlaying: boolean;
  onPlayAudio: (id: string) => void;
  onRatingChange: (id: string, rating: number | null) => void;
  onContentChange: (id: string, content: string) => void;
}

export default function FeedbackItem({
  question,
  index,
  answer,
  feedback,
  isPlaying,
  onPlayAudio,
  onRatingChange,
  onContentChange,
}: FeedbackItemProps) {
  return (
    <ContentBox>
      <Stack spacing={3}>
        {/* Question */}
        <Box>
          <Chip
            label={`질문 ${index + 1}`}
            size="small"
            sx={{
              mb: 1,
              bgcolor: '#f3f4f6',
              color: '#667eea',
              fontWeight: 600,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1f2937',
            }}
          >
            {question.content}
          </Typography>
        </Box>

        <Divider />

        {/* My Answer */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              나의 답변
            </Typography>
            <IconButton
              onClick={() => onPlayAudio(question.id)}
              sx={{
                color: isPlaying ? '#dc2626' : '#667eea',
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Box>
          <Paper
            elevation={0}
            sx={{
              bgcolor: '#f9fafb',
              p: 2,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {answer}
            </Typography>
          </Paper>
        </Box>

        <Divider />

        {/* Rating */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            만족도
          </Typography>
          <Rating
            value={feedback.rating}
            onChange={(_, newValue) => onRatingChange(question.id, newValue)}
            size="large"
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#667eea',
              },
              '& .MuiRating-iconHover': {
                color: '#764ba2',
              },
            }}
          />
        </Box>

        {/* Feedback Text */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            피드백
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={feedback.content}
            onChange={(e) => onContentChange(question.id, e.target.value)}
            placeholder="이 답변에 대한 피드백을 작성해주세요..."
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              },
            }}
          />
        </Box>
      </Stack>
    </ContentBox>
  );
}
