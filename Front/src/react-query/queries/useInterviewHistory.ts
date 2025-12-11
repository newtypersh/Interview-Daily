import { useInfiniteQuery } from '@tanstack/react-query';
import { getInterviews } from '../../apis/history';
import type { InterviewHistoryResponse } from '../../apis/history/types';

export const useInterviewHistory = (limit: number = 20) => {
  return useInfiniteQuery<InterviewHistoryResponse, Error>({
    queryKey: ['interviewHistory', limit],
    queryFn: ({ pageParam }) => {
      const { cursorCreatedAt, cursorId } = pageParam as { cursorCreatedAt?: string; cursorId?: number } || {};
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
