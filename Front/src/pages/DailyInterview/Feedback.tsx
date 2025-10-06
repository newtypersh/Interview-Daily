import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  TextField,
  Divider,
  Rating,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import type { Question } from '../../types';

// Mock data
const mockQuestions: Question[] = [
  { id: '1', content: '1분 자기소개 시작해주세요', order: 1 },
  { id: '2', content: '만일 1분 자기소개에서 말한 1번째 경험을 어떻게 진행했었나요?', order: 2 },
];

// Mock answers - 실제로는 녹음된 답변 데이터를 받아올 것
const mockAnswers: Record<string, string> = {
  '1': '안녕하세요. 저는 3년차 프론트엔드 개발자입니다. 주로 React와 TypeScript를 사용하여 웹 애플리케이션을 개발해왔으며, 최근에는 Next.js를 활용한 프로젝트에 참여하고 있습니다.',
  '2': '해당 프로젝트에서는 먼저 요구사항을 분석하고, 팀원들과 함께 기술 스택을 선정했습니다. 그 후 컴포넌트 설계를 진행하고, 점진적으로 기능을 구현해나갔습니다.',
};

interface QuestionFeedback {
  rating: number;
  content: string;
}

export default function Feedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Record<string, QuestionFeedback>>(
    mockQuestions.reduce((acc, q) => ({
      ...acc,
      [q.id]: { rating: 0, content: '' }
    }), {})
  );
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handleRatingChange = (questionId: string, rating: number | null) => {
    setFeedbacks({
      ...feedbacks,
      [questionId]: { ...feedbacks[questionId], rating: rating || 0 }
    });
  };

  const handleContentChange = (questionId: string, content: string) => {
    setFeedbacks({
      ...feedbacks,
      [questionId]: { ...feedbacks[questionId], content }
    });
  };

  const handlePlayAudio = (questionId: string) => {
    if (playingAudio === questionId) {
      setPlayingAudio(null);
      // TODO: Stop audio playback
    } else {
      setPlayingAudio(questionId);
      // TODO: Start audio playback
      // 실제 구현 시에는 녹음된 오디오를 재생
      setTimeout(() => setPlayingAudio(null), 3000); // 임시로 3초 후 자동 정지
    }
  };

  const handleSubmit = () => {
    // TODO: Save feedbacks to backend
    console.log('Feedbacks:', feedbacks);
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', py: 6 }}>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 3,
          }}
        >
          {/* Header */}
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

          {/* Feedback Forms */}
          <Stack spacing={4}>
            {mockQuestions.map((question, index) => (
              <Paper
                key={question.id}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: { xs: 3, md: 4 },
                }}
              >
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
                        onClick={() => handlePlayAudio(question.id)}
                        sx={{
                          color: playingAudio === question.id ? '#dc2626' : '#667eea',
                        }}
                      >
                        {playingAudio === question.id ? <PauseIcon /> : <PlayArrowIcon />}
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
                        {mockAnswers[question.id]}
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
                      value={feedbacks[question.id].rating}
                      onChange={(_, newValue) => handleRatingChange(question.id, newValue)}
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
                      value={feedbacks[question.id].content}
                      onChange={(e) => handleContentChange(question.id, e.target.value)}
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
              </Paper>
            ))}
          </Stack>

          {/* Submit Button */}
          <Box sx={{ mt: 6 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              endIcon={<SendIcon />}
              onClick={handleSubmit}
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
