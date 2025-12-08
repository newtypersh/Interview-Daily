import { useSubmitFeedback } from '../../../../react-query/mutation/useSubmitFeedback';
import type { Question, QuestionFeedback } from './useFeedbackForm';

interface UseFeedbackSubmissionProps {
  interviewId: string | undefined;
  questions: Question[];
  feedbacks: Record<string, QuestionFeedback>;
}

export const useFeedbackSubmission = ({ interviewId, questions, feedbacks }: UseFeedbackSubmissionProps) => {
  const { mutate: submitFeedback, isPending: isSubmitting } = useSubmitFeedback(interviewId || '');

  const submit = () => {
    if (!interviewId) return;

    const formattedFeedbacks = Object.entries(feedbacks)
      .map(([questionId, feedback]) => {
        const question = questions.find((q) => q.id === questionId);
        if (!question?.answerId) return null;

        return {
          answerId: question.answerId,
          score: feedback.rating,
          comment: feedback.content,
        };
      })
      .filter((item): item is { answerId: string; score: number; comment: string } => item !== null);

    if (formattedFeedbacks.length === 0) {
      alert('제출할 피드백이 없습니다.');
      return;
    }

    submitFeedback(
      { feedbacks: formattedFeedbacks },
      {
        onSuccess: () => {
          alert('피드백이 성공적으로 제출되었습니다.');
        },
        onError: () => {
          alert('피드백 제출에 실패했습니다.');
        },
      }
    );
  };

  return {
    submit,
    isSubmitting,
  };
};
