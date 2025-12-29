import { useSubmitFeedback } from '../../../../react-query/mutation/useSubmitFeedback';
import { useNavigate } from 'react-router-dom';
import type { FeedbackItem } from '../utils/feedbackMapper';
import type { FeedbackFormValues } from '../schemas/form';

type UseFeedbackSubmissionProps = {
  interviewId: string | undefined;
  feedbackItems: FeedbackItem[];
}

export const useFeedbackSubmission = ({ interviewId, feedbackItems }: UseFeedbackSubmissionProps) => {
  const navigate = useNavigate();
  const { mutate: submitFeedback, isPending: isSubmitting } = useSubmitFeedback(interviewId || '');

  const onSubmit = (data: FeedbackFormValues) => {
    if (!interviewId) return;

    const formattedFeedbacks = Object.entries(data.feedbacks)
      .map(([questionId, feedback]) => {
        const item = feedbackItems.find((q) => q.id === questionId);
        if (!item?.answerId) return null;

        return {
          answerId: item.answerId,
          rating: feedback.rating,
          feedbackText: feedback.content,
        };
      })
      .filter((item): item is { answerId: string; rating: number; feedbackText: string } => item !== null && item.rating > 0);



    submitFeedback(
      { feedbacks: formattedFeedbacks },
      {
        onSuccess: () => {
          alert('피드백이 성공적으로 제출되었습니다.');
          navigate('/');
        },
        onError: () => {
          alert('피드백 제출에 실패했습니다.');
        },
      }
    );
  };

  return {
    onSubmit,
    isSubmitting,
  };
};
