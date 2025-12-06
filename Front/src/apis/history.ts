import { api } from './axios';
import type { InterviewHistoryResponse } from '../types';

export const getInterviewHistory = async ({ pageParam = 0 }: { pageParam?: number }) => {
  const response = await api.get<InterviewHistoryResponse>(
    `/interviews/history?cursor=${pageParam}&limit=10`
  );
  return response.data;
};
