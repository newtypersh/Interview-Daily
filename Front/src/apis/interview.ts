import { api } from './axios';

export interface InterviewAnswerDto {
  id: string;
  interviewId: string;
  questionId: string;
  sequence: number;
  audioUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  questionContent: string;
}

export interface InterviewDto {
  id: string;
  userId: string;
  questionSetId: string;
  day: string | null;
  interviewedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  answers: InterviewAnswerDto[];
}

export interface StartInterviewResponse {
  resultType: string;
  success: {
    interview: InterviewDto;
  };
  error?: any;
}

export const startInterview = async (strategy: string = 'random'): Promise<StartInterviewResponse> => {
  const response = await api.post<StartInterviewResponse>('/interviews/start', {
    strategy,
  });
  return response.data;
};

export const uploadAnswerAudio = async (
  interviewId: string,
  answerId: string,
  file: Blob | File
): Promise<InterviewAnswerDto> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<{ answer: InterviewAnswerDto }>(
    `/interviews/${interviewId}/answers/${answerId}/audio`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.answer;
};
