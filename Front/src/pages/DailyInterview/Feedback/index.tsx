import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useFeedbackForm, type Question } from './hooks/useFeedbackForm';
import FeedbackItem from './components/FeedbackItem';

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

export default function Feedback() {
  const {
    feedbacks,
    playingAudio,
    handleRatingChange,
    handleContentChange,
    handlePlayAudio,
    handleSubmit,
  } = useFeedbackForm(mockQuestions);

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
              <FeedbackItem
                key={question.id}
                question={question}
                index={index}
                answer={mockAnswers[question.id]}
                feedback={feedbacks[question.id]}
                isPlaying={playingAudio === question.id}
                onPlayAudio={handlePlayAudio}
                onRatingChange={handleRatingChange}
                onContentChange={handleContentChange}
              />
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

