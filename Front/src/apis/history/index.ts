import { api } from '../axios';
import { InterviewHistoryResponseSchema, type InterviewHistoryResponse, type InterviewHistoryData } from '../../schemas/history';

export const getInterviews = async (
  limit: number,
  cursorCreatedAt?: string,
  cursorId?: number
): Promise<InterviewHistoryData> => {
  const params: Record<string, string | number> = { limit };
  if (cursorCreatedAt) params.cursorCreatedAt = cursorCreatedAt;
  if (cursorId) params.cursorId = cursorId;

  const response = await api.get<InterviewHistoryResponse>('/history/interviews', {
    params,
  });
  
  const parsed = InterviewHistoryResponseSchema.parse(response.data);
  return parsed.success;
};
