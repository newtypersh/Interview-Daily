import { useQuery } from '@tanstack/react-query';
import type { Question } from '../../apis/questionSet/types';
import { getQuestions } from '../../apis/questionSet';

export const useQuestionsQuery = (questionSetId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['questions', questionSetId],
    queryFn: () => getQuestions(questionSetId),
    enabled,
  });
};
