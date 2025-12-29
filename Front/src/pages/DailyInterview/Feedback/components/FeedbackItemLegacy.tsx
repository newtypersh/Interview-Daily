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
import { useRenderCount } from '../../../../hooks/useRenderCount';
import ContentBox from '../../../../components/ContentBox';

type FeedbackItemLegacyProps = {
  question: { content: string | null; id: string };
  index: number;
  answer: string;
  rating: number;
  content: string;
  onRatingChange: (newValue: number | null) => void;
  onContentChange: (newValue: string) => void;
  isPlaying: boolean;
  onPlayAudio: (id: string) => void;
}

export default function FeedbackItemLegacy({
  question,
  index,
  answer,
  rating,
  content,
  onRatingChange,
  onContentChange,
  isPlaying,
  onPlayAudio,
}: FeedbackItemLegacyProps) {
  useRenderCount(`FeedbackItemLegacy-${index}`);

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
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
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
              sx={{ color: isPlaying ? '#dc2626' : '#667eea' }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Box>
          <Paper elevation={0} sx={{ bgcolor: '#f9fafb', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {answer}
            </Typography>
          </Paper>
        </Box>

        <Divider />

        {/* Rating (Legacy: Controlled by props) */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            만족도 (Legacy State)
          </Typography>
          <Box>
            <Rating
              value={rating}
              onChange={(_, newValue) => onRatingChange(newValue)}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': { color: '#ff6b6b' }, // 색상 변경으로 구분
                '& .MuiRating-iconHover': { color: '#ff8787' },
              }}
            />
          </Box>
        </Box>

        {/* Feedback Text (Legacy: Controlled by props) */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            피드백 (Legacy State)
          </Typography>
          <TextField
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder="[Legacy 모드] 글자를 입력할 때마다 전체 렌더링이 발생합니다..."
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#ff6b6b' },
                '&.Mui-focused fieldset': { borderColor: '#ff6b6b' },
              },
            }}
          />
        </Box>
      </Stack>
    </ContentBox>
  );
}
