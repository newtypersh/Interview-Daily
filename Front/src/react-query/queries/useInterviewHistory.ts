import { useInfiniteQuery } from '@tanstack/react-query';
import { getInterviews } from '../../apis/history';
import type { InterviewHistoryData } from '../../schemas/history';

export const useInterviewHistory = (limit: number = 20) => {
  return useInfiniteQuery<InterviewHistoryData, Error>({
    queryKey: ['interviewHistory', limit],
    queryFn: ({ pageParam }) => {
      const { cursorCreatedAt, cursorId } = pageParam as { cursorCreatedAt?: string; cursorId?: number };
      return getInterviews(limit, cursorCreatedAt, cursorId);
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNext) return undefined;
      return {
        cursorCreatedAt: lastPage.pagination.nextCursorCreatedAt,
        cursorId: lastPage.pagination.nextCursorId,
      };
    },
  });
};
