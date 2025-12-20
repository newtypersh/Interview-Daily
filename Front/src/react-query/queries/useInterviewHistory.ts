import { useInfiniteQuery } from '@tanstack/react-query';
import { getInterviews } from '../../apis/history';
import type { InterviewHistoryData } from '../../schemas/history';

export const useInterviewHistory = (limit: number = 20) => {
  return useInfiniteQuery<InterviewHistoryData, Error>({
    queryKey: ['interviewHistory', limit],
    queryFn: ({ pageParam }) => {
      const params = pageParam as { cursorCreatedAt?: string | null };
      return getInterviews({ limit, ...params });
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNext) return undefined;
      return {
        cursorCreatedAt: lastPage.pagination.nextCursorCreatedAt,
      };
    },
  });
};
