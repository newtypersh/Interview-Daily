import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestion, deleteQuestion, updateQuestion } from '../../apis/questionSet/index';
import type { Question } from '../../apis/questionSet/types';

export const useCreateQuestion = (questionSetId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Question, Error, string>({
    mutationFn: (content) => createQuestion(questionSetId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSetId] });
    },
  });
};

export const useUpdateQuestion = (questionSetId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Question, Error, { questionId: string; content: string }>({
    mutationFn: ({ questionId, content }) => updateQuestion(questionSetId, questionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSetId] });
    },
  });
};

export const useDeleteQuestion = (questionSetId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (questionId) => deleteQuestion(questionSetId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSetId] });
    },
  });
};
