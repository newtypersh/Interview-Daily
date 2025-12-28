import { useQuery } from '@tanstack/react-query';
import { getQuestionSets } from '../../apis/questionSet';

export const QUERY_KEY = ['questionSets'];

export const useQuestionSetsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getQuestionSets,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10,   // 10분
  });
};
