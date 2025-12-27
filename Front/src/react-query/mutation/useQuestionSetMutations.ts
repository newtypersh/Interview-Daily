import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestionSet, deleteQuestionSet, updateQuestionSet } from '../../apis/questionSet/index';
import type { QuestionSet } from '../../apis/questionSet';
import { INTERVIEW_CATEGORIES } from '../../constants/interview';
import { QUERY_KEY } from '../queries/useQuestionSetsQuery';

export const useCreateQuestionSet = () => {
  const queryClient = useQueryClient();
  return useMutation<QuestionSet, Error, { category: keyof typeof INTERVIEW_CATEGORIES; name: string }>({
    mutationFn: ({ category, name }) => createQuestionSet(category, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateQuestionSet = () => {
  const queryClient = useQueryClient();
  return useMutation<
    QuestionSet,
    Error,
    { id: string; name?: string; category?: keyof typeof INTERVIEW_CATEGORIES }
  >({
    mutationFn: ({ id, name, category }) => updateQuestionSet(id, { name, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteQuestionSet = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteQuestionSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
