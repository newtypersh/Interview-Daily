import { useSubmitFeedback } from '../../../../react-query/mutation/useSubmitFeedback';
import { useNavigate } from 'react-router-dom';
import { type FeedbackFormValues, FeedbackFormSchema } from '../schemas/form';

type UseFeedbackSubmissionProps = {
  interviewId: string | undefined;
}

export const useFeedbackSubmission = ({ interviewId }: UseFeedbackSubmissionProps) => {
  const navigate = useNavigate();
  const { mutate: submitFeedback, isPending: isSubmitting } = useSubmitFeedback(interviewId || '');

  const onSubmit = (data: FeedbackFormValues) => {
    if (!interviewId) return;

    // Zod Schema Transformation: Filters invalid ratings and maps to API format
    const payload = FeedbackFormSchema.parse(data);

    if (payload.feedbacks.length === 0) {
      alert('평가를 완료하고 싶은 항목에 점수를 매겨주세요.');
      return;
    }

    submitFeedback(
      { feedbacks: payload.feedbacks },
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
