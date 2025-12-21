import { useInfiniteQuery } from '@tanstack/react-query';
import { getInterviews } from '../../apis/history';

const LIMIT = 20;

export const useInterviewHistory = () => {
  return useInfiniteQuery({
    queryKey: ['interviewHistory'],
    queryFn: ({ pageParam }) => {
      return getInterviews({ limit: LIMIT, cursorCreatedAt: pageParam });
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
