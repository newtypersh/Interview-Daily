import { api } from '../axios';
import { InterviewHistoryResponseSchema, type InterviewHistoryResponse, type InterviewHistoryData } from '../../schemas/history';

type GetInterviewsParams = {
  limit: number;
  cursorCreatedAt?: string | null;
};

export const getInterviews = async ({
  limit,
  cursorCreatedAt,
}: GetInterviewsParams): Promise<InterviewHistoryData> => {
  const params: Record<string, string | number> = { limit };
  if (cursorCreatedAt) params.cursorCreatedAt = cursorCreatedAt;

  const response = await api.get<InterviewHistoryResponse>('/history/interviews', {
    params,
  });
  
  const parsed = InterviewHistoryResponseSchema.parse(response.data);
  return parsed.success;
};
