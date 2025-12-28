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
  
  const parsed = InterviewHistoryResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    console.error('getInterviews validation failed:', parsed.error);
    throw new Error('면접 기록 목록 검증에 실패했습니다.');
  }
  return parsed.data.success;
};
