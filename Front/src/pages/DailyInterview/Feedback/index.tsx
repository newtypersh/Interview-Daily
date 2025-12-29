import { useParams, Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useMemo } from 'react';
import { useFeedbackForm } from './hooks/useFeedbackForm';
import { useFeedbackSubmission } from './hooks/useFeedbackSubmission';
import FeedbackLayout from './components/FeedbackLayout';
import { useInterviewAnswers } from '../../../react-query/queries/useInterviewAnswers';
import { useFeedbackTemplatesByCategory } from '../../../react-query/queries/useFeedbackTemplates';
import { mapInterviewToFeedbackItems } from './utils/feedbackMapper';

export default function FeedbackContainer() {
  const { interviewId } = useParams<{ interviewId: string }>();

  if (!interviewId) {
    return <Navigate to="/" replace />;
  }

  const { interview, isPending, error } = useInterviewAnswers(interviewId);
  
  // 카테고리 기반 템플릿 조회
  const { templates } = useFeedbackTemplatesByCategory(interview?.category);
  const templateContent = templates?.[0]?.templateText || undefined; // 첫 번째 템플릿 사용
  
  // API 데이터를 UI 포맷으로 변환
  const feedbackItems = useMemo(() => mapInterviewToFeedbackItems(interview?.answers), [interview?.answers]);

  /* Hook Form Integration */
  const {
    form,
    playingAudio,
    handlePlayAudio,
  } = useFeedbackForm(feedbackItems, templateContent);

  const { control, handleSubmit } = form;

  const { onSubmit, isSubmitting } = useFeedbackSubmission({
    interviewId,
  });

  if (isPending) {
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
      feedbackItems={feedbackItems}
      control={control}
      templateContent={templateContent}
      category={interview.category}
      playingAudio={playingAudio}
      isSubmitting={isSubmitting}
      onPlayAudio={handlePlayAudio}
      onSubmit={handleSubmit(onSubmit, (errors) => {
        if (errors.root) {
          alert(errors.root.message);
        }
      })}
    />
  );
}

