import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '../../apis/questionSet';

export const useQuestionsQuery = (questionSetId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['questions', questionSetId],
    queryFn: () => getQuestions(questionSetId),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
