import { api } from '../axios';
import type { FeedbackSubmissionRequest, FeedbackSubmissionResult, FeedbackSubmissionResponse } from '../../schemas/feedback';
import { FeedbackSubmissionRequestSchema, FeedbackSubmissionResponseSchema } from '../../schemas/feedback';

export const submitFeedbacks = async (interviewId: string, data: FeedbackSubmissionRequest): Promise<FeedbackSubmissionResult> => {
  // Validate Request
  FeedbackSubmissionRequestSchema.parse(data);
  
  const response = await api.post<FeedbackSubmissionResponse>(`/interviews/${interviewId}/feedbacks`, data);
  
  // Validate Response
  const parsed = FeedbackSubmissionResponseSchema.parse(response.data);
  return parsed.success;
};
