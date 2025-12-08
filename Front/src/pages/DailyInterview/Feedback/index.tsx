import { useLocation, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useFeedbackForm } from './hooks/useFeedbackForm';
import { useFeedbackSubmission } from './hooks/useFeedbackSubmission';
import FeedbackHeader from './components/FeedbackHeader';
import FeedbackTemplateGuide from './components/FeedbackTemplateGuide';
import FeedbackList from './components/FeedbackList';
import { useInterviewAnswers } from '../../../react-query/queries/useInterviewAnswers';
import { useFeedbackTemplate } from '../../../react-query/queries/useFeedbackTemplate';
import { mapInterviewToQuestions } from './utils/feedbackMapper';

export default function Feedback() {
  const location = useLocation();
  // Location state에서 interviewId 가져오기
  const interviewId = location.state?.interviewId as string | undefined;

  const { interview, isLoading, error } = useInterviewAnswers(interviewId || null);
  
  // 카테고리 기반 템플릿 조회
  const { templates } = useFeedbackTemplate(interview?.category);
  const templateContent = templates?.[0]?.templateText; // 첫 번째 템플릿 사용
  
  // API 데이터를 UI 포맷으로 변환
  const questions = mapInterviewToQuestions(interview?.answers);

  const {
    feedbacks,
    playingAudio,
    handleRatingChange,
    handleContentChange,
    handlePlayAudio,
  } = useFeedbackForm(questions, templateContent);

  const { submit, isSubmitting } = useFeedbackSubmission({
    interviewId,
    questions,
    feedbacks
  });

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
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
          <FeedbackHeader />
          <FeedbackTemplateGuide content={templateContent} category={interview?.category} />
          
          <Box sx={{ mb: 6 }}>
            <FeedbackList
              questions={questions}
              feedbacks={feedbacks}
              playingAudio={playingAudio}
              onPlayAudio={handlePlayAudio}
              onRatingChange={handleRatingChange}
              onContentChange={handleContentChange}
            />
          </Box>

          <Box sx={{ mt: 6 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              onClick={submit}
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

