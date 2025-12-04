import { api } from './axios';

export interface InterviewHistoryItem {
  id: number;
  createdAt: string;
  totalScore: number;
  questionCount: number;
}

export interface InterviewHistoryResponse {
  data: InterviewHistoryItem[];
  pagination: {
    nextCursorCreatedAt: string | null;
    nextCursorId: number | null;
    hasNext: boolean;
  };
}

export const getInterviews = async (limit: number, cursorCreatedAt?: string | null, cursorId?: number | null): Promise<InterviewHistoryResponse> => {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  if (cursorCreatedAt) params.append('cursorCreatedAt', cursorCreatedAt);
  if (cursorId) params.append('cursorId', cursorId.toString());

  const response = await api.get<{ success: InterviewHistoryResponse }>(`/history/interviews?${params.toString()}`);
  return response.data.success;
};
