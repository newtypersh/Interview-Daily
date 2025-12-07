import { api } from './axios';
import type { InterviewHistoryResponse } from '../types';

export const getInterviews = async (
  limit: number,
  cursorCreatedAt?: string,
  cursorId?: number
) => {
  const params: Record<string, any> = { limit };
  if (cursorCreatedAt) params.cursorCreatedAt = cursorCreatedAt;
  if (cursorId) params.cursorId = cursorId;

  const response = await api.get<InterviewHistoryResponse>('/interviews/history', {
    params,
  });
  return response.data;
};
