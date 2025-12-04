import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  deleteQuestionSet,
  updateQuestionSet,
} from '../apis/questionSet';

export const useQuestionSetActions = (questionSetId: string, expanded: boolean = false) => {
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions', questionSetId],
    queryFn: () => getQuestions(questionSetId),
    enabled: expanded,
  });

  const createQuestionMutation = useMutation({
    mutationFn: (content: string) => createQuestion(questionSetId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSetId] });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, content }: { questionId: string; content: string }) =>
      updateQuestion(questionSetId, questionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSetId] });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionSetId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSetId] });
    },
  });

  const deleteSetMutation = useMutation({
    mutationFn: () => deleteQuestionSet(questionSetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionSets'] });
    },
  });

  const updateSetMutation = useMutation({
    mutationFn: (name: string) => updateQuestionSet(questionSetId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionSets'] });
    },
  });

  return {
    questions,
    isLoadingQuestions,
    createQuestion: createQuestionMutation.mutate,
    updateQuestion: updateQuestionMutation.mutate,
    deleteQuestion: deleteQuestionMutation.mutate,
    deleteSet: deleteSetMutation.mutate,
    updateSet: updateSetMutation.mutate,
    isCreatingQuestion: createQuestionMutation.isPending,
    isUpdatingQuestion: updateQuestionMutation.isPending,
    isDeletingQuestion: deleteQuestionMutation.isPending,
    isDeletingSet: deleteSetMutation.isPending,
    isUpdatingSet: updateSetMutation.isPending,
  };
};
