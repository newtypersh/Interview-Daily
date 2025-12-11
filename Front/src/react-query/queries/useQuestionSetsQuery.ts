import { useQuery } from '@tanstack/react-query';
import type { QuestionSet } from '../../apis/questionSet/types';
import { getQuestionSets } from '../../apis/questionSet';

// Actually, looking at the original file: import { getQuestionSets } from '../apis/questionSet';
// The strict type might be inferred from the API function.

export const QUERY_KEY = ['questionSets'];

export const useQuestionSetsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getQuestionSets,
  });
};
