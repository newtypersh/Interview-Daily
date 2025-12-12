import { useMutation } from '@tanstack/react-query';
import { completeInterview } from '../../../apis/interview';

interface UseInterviewCompletionProps {
  onSuccess: (data: any, variables: string, context: unknown) => void;
  onError: (error: Error) => void;
}

export const useInterviewCompletion = ({ onSuccess, onError }: UseInterviewCompletionProps) => {
  const { mutate: complete, isPending: isCompleting, error } = useMutation<any, Error, string>({
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
