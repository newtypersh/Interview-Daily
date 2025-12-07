import { useLocation, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useFeedbackForm } from './hooks/useFeedbackForm';
import FeedbackItem from './components/FeedbackItem';
import { useInterviewAnswers } from '../../../react-query/queries/useInterviewAnswers';
import { useFeedbackTemplate } from '../../../react-query/queries/useFeedbackTemplate';

export default function Feedback() {
  const location = useLocation();
  // Location state에서 interviewId 가져오기
  const interviewId = location.state?.interviewId as string | undefined;

  const { interview, isLoading, error } = useInterviewAnswers(interviewId || null);
  
  // 카테고리 기반 템플릿 조회
  const { templates } = useFeedbackTemplate(interview?.category);
  const templateContent = templates?.[0]?.templateText; // 첫 번째 템플릿 사용
  
  // API 데이터를 UI 포맷으로 변환
  const questions = interview?.answers.map(a => ({
    id: a.questionId, // 답변 ID가 아닌 질문 ID를 식별자로 사용 (일관성 유지)
    content: a.questionContent,
    order: a.sequence,
    answerId: a.id, // 답변 고유 ID도 필요할 수 있으므로 저장 (useFeedbackForm에서 활용 가능성)
    audioUrl: a.audioUrl,
    transcript: a.transcriptText,
  })) || [];

  const {
    feedbacks,
    playingAudio,
    handleRatingChange,
    handleContentChange,
    handlePlayAudio,
    handleSubmit,
  } = useFeedbackForm(questions, templateContent);

  if (!interviewId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'white' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !interview) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'white' }}>
        <Typography color="error">
          인터뷰 데이터를 불러들이는데 실패했습니다.
        </Typography>
      </Box>
    );
  }

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
            {/* Template Display */}
            {templateContent && (
              <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  💡 피드백 가이드 ({interview?.category || 'General'})
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {templateContent}
                </Typography>
              </Box>
            )}

            {questions.map((q, index) => (
              <FeedbackItem
                key={q.id}
                question={q}
                index={index}
                answer={q.transcript || '답변 내용이 없습니다.'}
                feedback={feedbacks[q.id]}
                isPlaying={playingAudio === q.id}
                onPlayAudio={() => q.audioUrl && handlePlayAudio(q.id)} // 오디오 URL이 있을 때만 재생 트리거
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

