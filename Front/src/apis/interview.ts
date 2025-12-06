import { api } from './axios';

export const startInterview = async (strategy: string) => {
  const response = await api.post('/interviews/start', { strategy });
  return response.data;
};

export const getInterview = async (interviewId: string) => {
  const response = await api.get(`/interviews/${interviewId}`);
  return response.data;
};

export const getInterviewAnswers = async (interviewId: string) => {
  const response = await api.get(`/interviews/${interviewId}/answers`);
  return response.data;
};

export const uploadAnswerAudio = async (interviewId: string, answerId: string, blob: Blob) => {
  const formData = new FormData();
  formData.append('file', blob, 'answer.webm');
  
  const response = await api.post(`/interviews/${interviewId}/answers/${answerId}/audio`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const submitFeedbacks = async (interviewId: string, feedbacks: { answerId: string; rating: number; feedbackText?: string }[]) => {
  const response = await api.post(`/interviews/${interviewId}/feedbacks`, { feedbacks });
  return response.data;
};

export const completeInterview = async (interviewId: string) => {
    const response = await api.post(`/interviews/${interviewId}/complete`);
    return response.data;
};
