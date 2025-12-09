import { api } from './axios';
import type { StartInterviewResponse, InterviewDto, UploadAudioResponse } from '../types/interview';

export const startInterview = async (strategy: string): Promise<StartInterviewResponse> => {
  const response = await api.post<StartInterviewResponse>('/interviews/start', { strategy });
  return response.data;
};

export const getInterview = async (interviewId: string): Promise<{ interview: InterviewDto }> => {
  const response = await api.get<{ interview: InterviewDto }>(`/interviews/${interviewId}`);
  return response.data;
};

export const getInterviewAnswers = async (interviewId: string): Promise<InterviewDto> => {
  const response = await api.get<InterviewDto>(`/interviews/${interviewId}/answers`);
  return response.data;
};

export const uploadAnswerAudio = async (interviewId: string, answerId: string, blob: Blob): Promise<UploadAudioResponse> => {
  const formData = new FormData();
  formData.append('file', blob, 'answer.webm');
  
  const response = await api.post<UploadAudioResponse>(`/interviews/${interviewId}/answers/${answerId}/audio`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const submitFeedbacks = async (interviewId: string, feedbacks: { answerId: string; rating: number; feedbackText?: string }[]): Promise<{ message: string; count: number }> => {
  const response = await api.post<{ success: { message: string; count: number } }>(`/interviews/${interviewId}/feedbacks`, { feedbacks });
  return response.data.success;
};

export const completeInterview = async (interviewId: string): Promise<any> => {
    const response = await api.post(`/interviews/${interviewId}/complete`);
    return response.data;
};
