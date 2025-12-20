import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeInterview } from '../../../apis/interview';
import type { CompleteInterviewResponse } from '../../../schemas/interview';

type UseInterviewCompletionProps = {
  onSuccess: (data: CompleteInterviewResponse, variables: string, context: unknown) => void;
  onError: (error: Error) => void;
}

export const useInterviewCompletion = ({ onSuccess, onError }: UseInterviewCompletionProps) => {
  const queryClient = useQueryClient();

  const { mutate: complete, isPending: isCompleting, error } = useMutation<CompleteInterviewResponse, Error, string>({
    mutationFn: (interviewId) => completeInterview(interviewId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['interviewHistory'] });
      onSuccess(data, variables, context);
    },
    onError,
  });

  return {
    complete,
    isCompleting,
    error,
  };
};
