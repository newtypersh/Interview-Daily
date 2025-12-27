import { api } from '../axios';
import { 
  StartInterviewResponseSchema, 
  InterviewSchema, 
  UploadAudioResponseSchema, 
  CompleteInterviewResponseSchema,
  type StartInterviewResponse,
  type Interview,
  type UploadAudioResponse,
  type CompleteInterviewResponse,
} from '../../schemas/interview';

export type { StartInterviewResponse, Interview, UploadAudioResponse, CompleteInterviewResponse };
export { StartInterviewResponseSchema, InterviewSchema, UploadAudioResponseSchema, CompleteInterviewResponseSchema };
import { z } from 'zod';

export const startInterview = async (strategy: string): Promise<StartInterviewResponse> => {
  const response = await api.post<StartInterviewResponse>('/interviews/start', { strategy });
  return StartInterviewResponseSchema.parse(response.data);
};

export const getInterview = async (interviewId: string): Promise<{ interview: Interview }> => {
  const response = await api.get<{ interview: Interview }>(`/interviews/${interviewId}`);
  return z.object({ interview: InterviewSchema }).parse(response.data);
};

export const getInterviewAnswers = async (interviewId: string): Promise<Interview> => {
  const response = await api.get<Interview>(`/interviews/${interviewId}/answers`);
  return InterviewSchema.parse(response.data);
};

export const uploadAnswerAudio = async (interviewId: string, answerId: string, blob: Blob): Promise<UploadAudioResponse> => {
  const formData = new FormData();
  formData.append('file', blob, 'answer.webm');
  
  const response = await api.post<UploadAudioResponse>(`/interviews/${interviewId}/answers/${answerId}/audio`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return UploadAudioResponseSchema.parse(response.data);
};

export const submitFeedbacks = async (interviewId: string, feedbacks: { answerId: string; rating: number; feedbackText?: string }[]): Promise<{ message: string; count: number }> => {
  const response = await api.post<{ success: { message: string; count: number } }>(`/interviews/${interviewId}/feedbacks`, { feedbacks });
  // Simple inline validation for this specific response
  const schema = z.object({ message: z.string(), count: z.number() });
  return schema.parse(response.data.success);
};

export const completeInterview = async (interviewId: string): Promise<CompleteInterviewResponse> => {
    const response = await api.post<{ success: { data: CompleteInterviewResponse } }>(`/interviews/${interviewId}/complete`);
    // Note: The API response structure seems to be nested in success.data based on original code
    // Original: return response.data.success.data;
    // Schema matches CompleteInterviewResponse
    return CompleteInterviewResponseSchema.parse(response.data.success.data);
};
