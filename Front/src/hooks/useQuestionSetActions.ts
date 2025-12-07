import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useDeleteQuestionSet,
  useUpdateQuestionSet,
} from '../react-query/mutation/useQuestionSetMutations';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
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

  const { mutate: deleteSet, isPending: isDeletingSet } = useDeleteQuestionSet();
  const { mutate: updateSet, isPending: isUpdatingSet } = useUpdateQuestionSet();

  return {
    questions,
    isLoadingQuestions,
    createQuestion: createQuestionMutation.mutate,
    updateQuestion: updateQuestionMutation.mutate,
    deleteQuestion: deleteQuestionMutation.mutate,
    deleteSet: () => deleteSet(questionSetId),
    updateSet: (name: string) => updateSet({ id: questionSetId, name }),
    isCreatingQuestion: createQuestionMutation.isPending,
    isUpdatingQuestion: updateQuestionMutation.isPending,
    isDeletingQuestion: deleteQuestionMutation.isPending,
    isDeletingSet,
    isUpdatingSet,
  };
};
