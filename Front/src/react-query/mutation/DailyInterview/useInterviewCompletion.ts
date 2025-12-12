import { useMutation } from '@tanstack/react-query';
import { completeInterview } from '../../../apis/interview';
import type { CompleteInterviewResponse } from '../../../apis/interview/types';

interface UseInterviewCompletionProps {
  onSuccess: (data: CompleteInterviewResponse, variables: string, context: unknown) => void;
  onError: (error: Error) => void;
}

export const useInterviewCompletion = ({ onSuccess, onError }: UseInterviewCompletionProps) => {
  const { mutate: complete, isPending: isCompleting, error } = useMutation<CompleteInterviewResponse, Error, string>({
    mutationFn: (interviewId) => completeInterview(interviewId),
    onSuccess,
    onError,
  });

  return {
    complete,
    isCompleting,
    error,
  };
};
