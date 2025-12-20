import { useInfiniteQuery } from '@tanstack/react-query';
import { getInterviews } from '../../apis/history';
import type { InterviewHistoryData } from '../../schemas/history';

export const useInterviewHistory = (limit: number = 20) => {
  return useInfiniteQuery<InterviewHistoryData, Error>({
    queryKey: ['interviewHistory', limit],
    queryFn: ({ pageParam }) => {
      const cursorCreatedAt = pageParam as string | null;
      return getInterviews({ limit, cursorCreatedAt });
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNext) return undefined;
      return lastPage.pagination.nextCursorCreatedAt;
    },
    staleTime: Infinity, // 무한대 (invalidateQueries로만 갱신)
    gcTime: 1000 * 60 * 30, // 30분
  });
};
