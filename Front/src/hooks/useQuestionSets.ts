import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getQuestionSets,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
} from '../apis/questionSet';
import { INTERVIEW_CATEGORIES } from '../constants/interview';

export const useQuestionSets = () => {
  const queryClient = useQueryClient();

  const { data: questionSets = [], isLoading, error } = useQuery({
    queryKey: ['questionSets'],
    queryFn: getQuestionSets,
  });

  const createMutation = useMutation({
    mutationFn: ({ category, name }: { category: keyof typeof INTERVIEW_CATEGORIES; name: string }) =>
      createQuestionSet(category, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionSets'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name, category }: { id: string; name?: string; category?: keyof typeof INTERVIEW_CATEGORIES }) =>
      updateQuestionSet(id, { name, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionSets'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteQuestionSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionSets'] });
    },
  });

  return {
    questionSets,
    isLoading,
    error,
    createQuestionSet: createMutation.mutate,
    updateQuestionSet: updateMutation.mutate,
    deleteQuestionSet: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
