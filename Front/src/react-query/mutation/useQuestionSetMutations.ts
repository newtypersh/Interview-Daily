import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestionSet, deleteQuestionSet, updateQuestionSet } from '../apis/questionSet';
import type { QuestionSet } from '../apis/questionSet/types';
import { INTERVIEW_CATEGORIES } from '../../constants/interview';
import { QUERY_KEY } from '../queries/useQuestionSetsQuery';

export const useCreateQuestionSet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ category, name }: { category: keyof typeof INTERVIEW_CATEGORIES; name: string }) =>
      createQuestionSet(category, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateQuestionSet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, category }: { id: string; name?: string; category?: keyof typeof INTERVIEW_CATEGORIES }) =>
      updateQuestionSet(id, { name, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteQuestionSet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQuestionSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
