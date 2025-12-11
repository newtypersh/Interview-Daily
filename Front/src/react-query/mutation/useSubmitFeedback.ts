import { useMutation } from '@tanstack/react-query';
import { submitFeedbacks } from '../../apis/feedback';
import type { FeedbackSubmissionRequest } from '../../apis/feedback/types';

export const useSubmitFeedback = (interviewId: string) => {
  return useMutation({
    mutationFn: (data: FeedbackSubmissionRequest) => submitFeedbacks(interviewId, data),
  });
};
