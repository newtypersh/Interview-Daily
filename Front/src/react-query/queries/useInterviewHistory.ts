import { useInfiniteQuery } from '@tanstack/react-query';
import { getInterviews } from '../../apis/history';

export const useInterviewHistory = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['interviewHistory', limit],
    queryFn: ({ pageParam }) => {
      return getInterviews({ limit, cursorCreatedAt: pageParam });
    },
    initialPageParam: null as string | null, // 타입 추론을 위해 명시
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNext) return undefined;
      return lastPage.pagination.nextCursorCreatedAt;
    },
    staleTime: Infinity, // 무한대 (invalidateQueries로만 갱신)
    gcTime: 1000 * 60 * 30, // 30분
  });
};
