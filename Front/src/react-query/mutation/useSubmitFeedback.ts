import { useMutation } from '@tanstack/react-query';
import { submitFeedbacks } from '../../apis/feedback/index';
import type { FeedbackSubmissionRequest } from '../../schemas/feedback';

export const useSubmitFeedback = (interviewId: string) => {
  return useMutation({
    mutationFn: (data: FeedbackSubmissionRequest) => submitFeedbacks(interviewId, data),
  });
};
