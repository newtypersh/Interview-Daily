import { useMutation } from '@tanstack/react-query';
import { submitFeedbacks } from '../../apis/feedback/index';
import type { FeedbackSubmissionRequest } from '../../apis/feedback/types';

export const useSubmitFeedback = (interviewId: string) => {
  return useMutation<void, Error, FeedbackSubmissionRequest>({
    mutationFn: (data) => submitFeedbacks(interviewId, data),
  });
};
