import { api } from '../axios';
import { 
  FeedbackSubmissionRequestSchema, 
  FeedbackSubmissionResponseSchema,
  type FeedbackSubmissionRequest,
  type FeedbackSubmissionResponse,
  type FeedbackSubmissionResult,
} from '../../schemas/feedback';

export const submitFeedbacks = async (interviewId: string, data: FeedbackSubmissionRequest): Promise<FeedbackSubmissionResult> => {
  // Validate Request
  const requestValidation = FeedbackSubmissionRequestSchema.safeParse(data);
  if (!requestValidation.success) {
    console.error('submitFeedbacks request validation failed:', requestValidation.error);
    throw new Error('피드백 제출 요청 데이터가 올바르지 않습니다.');
  }

  const response = await api.post<FeedbackSubmissionResponse>(`/interviews/${interviewId}/feedbacks`, data);
  
  // Validate Response
  const parsed = FeedbackSubmissionResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    console.error('submitFeedbacks response validation failed:', parsed.error);
    throw new Error('피드백 제출 응답 검증에 실패했습니다.');
  }
  return parsed.data.success;
};
