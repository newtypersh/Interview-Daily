import { api } from '../axios';
import type { FeedbackSubmissionRequest } from './types';

export const submitFeedbacks = async (interviewId: string, data: FeedbackSubmissionRequest): Promise<void> => {
  await api.post(`/interviews/${interviewId}/feedbacks`, data);
};
