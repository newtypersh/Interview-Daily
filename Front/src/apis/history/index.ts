import { api } from '../axios';
import { InterviewHistoryResponseSchema, type InterviewHistoryResponse } from '../../schemas/history';

export const getInterviews = async (
  limit: number,
  cursorCreatedAt?: string,
  cursorId?: number
) => {
  const params: Record<string, string | number> = { limit };
  if (cursorCreatedAt) params.cursorCreatedAt = cursorCreatedAt;
  if (cursorId) params.cursorId = cursorId;

  const response = await api.get<{ success: InterviewHistoryResponse }>('/history/interviews', {
    params,
  });
  
  return InterviewHistoryResponseSchema.parse(response.data.success);
};
