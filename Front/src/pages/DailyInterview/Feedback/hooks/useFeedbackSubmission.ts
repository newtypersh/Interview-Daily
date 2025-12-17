import { useSubmitFeedback } from '../../../../react-query/mutation/useSubmitFeedback';
import { useNavigate } from 'react-router-dom';
import type { Question } from './useFeedbackForm';
import type { FeedbackFormValues } from '../schemas/form';

type UseFeedbackSubmissionProps = {
  interviewId: string | undefined;
  questions: Question[];
}

export const useFeedbackSubmission = ({ interviewId, questions }: UseFeedbackSubmissionProps) => {
  const navigate = useNavigate();
  const { mutate: submitFeedback, isPending: isSubmitting } = useSubmitFeedback(interviewId || '');

  const onSubmit = (data: FeedbackFormValues) => {
    if (!interviewId) return;

    const formattedFeedbacks = Object.entries(data.feedbacks)
      .map(([questionId, feedback]) => {
        const question = questions.find((q) => q.id === questionId);
        if (!question?.answerId) return null;

        return {
          answerId: question.answerId,
          rating: feedback.rating,
          feedbackText: feedback.content,
        };
      })
      .filter((item): item is { answerId: string; rating: number; feedbackText: string } => item !== null && item.rating > 0);

    // Minimum 1 feedback check (though schema might have checked it, explicit check is safe)
    if (formattedFeedbacks.length === 0) {
      alert('평가를 완료하고 싶은 항목에 점수를 매겨주세요.');
      return;
    }

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
