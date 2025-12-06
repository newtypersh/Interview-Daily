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
