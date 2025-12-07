import { useMutation } from '@tanstack/react-query';
import { submitFeedbacks } from '../../apis/feedback';
import type { FeedbackSubmissionRequest } from '../../types';

export const useSubmitFeedback = (interviewId: string) => {
  return useMutation({
    mutationFn: (data: FeedbackSubmissionRequest) => submitFeedbacks(interviewId, data),
  });
};
