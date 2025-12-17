import { useParams, Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useFeedbackForm } from './hooks/useFeedbackForm';
import { useFeedbackSubmission } from './hooks/useFeedbackSubmission';
import FeedbackLayout from './components/FeedbackLayout';
import { useInterviewAnswers } from '../../../react-query/queries/useInterviewAnswers';
import { useFeedbackTemplatesByCategory } from '../../../react-query/queries/useFeedbackTemplates';
import { mapInterviewToQuestions } from './utils/feedbackMapper';

export default function FeedbackContainer() {
  const { interviewId } = useParams<{ interviewId: string }>();

  const { interview, isLoading, error } = useInterviewAnswers(interviewId || null);
  
  // 카테고리 기반 템플릿 조회
  const { templates } = useFeedbackTemplatesByCategory(interview?.category);
  const templateContent = templates?.[0]?.templateText || undefined; // 첫 번째 템플릿 사용
  
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
    <FeedbackLayout
      questions={questions}
      feedbacks={feedbacks}
      templateContent={templateContent}
      category={interview.category}
      playingAudio={playingAudio}
      isSubmitting={isSubmitting}
      onPlayAudio={handlePlayAudio}
      onRatingChange={handleRatingChange}
      onContentChange={handleContentChange}
      onSubmit={submit}
    />
  );
}

