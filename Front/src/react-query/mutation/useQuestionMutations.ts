import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestion, deleteQuestion, updateQuestion } from '../apis/questionSet';
import type { Question } from '../apis/questionSet/types';

export const useCreateQuestion = (questionSetId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => createQuestion(questionSetId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSetId] });
    },
  });
};

export const useUpdateQuestion = (questionSetId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, content }: { questionId: string; content: string }) =>
      updateQuestion(questionSetId, questionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSetId] });
    },
  });
};

export const useDeleteQuestion = (questionSetId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionSetId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSetId] });
    },
  });
};
