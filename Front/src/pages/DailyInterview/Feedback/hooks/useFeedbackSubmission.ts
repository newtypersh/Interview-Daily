import { useSubmitFeedback } from '../../../../react-query/mutation/useSubmitFeedback';
import { useNavigate } from 'react-router-dom';
import { type FeedbackFormValues, FeedbackFormSchema } from '../schemas/form';

type UseFeedbackSubmissionProps = {
  interviewId: string;
}

export const useFeedbackSubmission = ({ interviewId }: UseFeedbackSubmissionProps) => {
  const navigate = useNavigate();
  // interviewId는 상위 컴포넌트에서 보장됨
  const { mutate: submitFeedback, isPending: isSubmitting } = useSubmitFeedback(interviewId);

  const onSubmit = (data: FeedbackFormValues) => {

    // Zod Schema Transformation: Filters invalid ratings and maps to API format
    const payload = FeedbackFormSchema.parse(data);

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
