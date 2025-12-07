import { useMutation } from '@tanstack/react-query';
import { completeInterview } from '../../../apis/interview';
import { handleError } from '../../../utils/errorHandler';

interface UseInterviewCompletionProps {
  onSuccess: (data: any, variables: string, context: unknown) => void;
  onError: (error: Error) => void;
}

export const useInterviewCompletion = ({ onSuccess, onError }: UseInterviewCompletionProps) => {
  const { mutate: complete, isPending: isCompleting, error } = useMutation({
    mutationFn: (interviewId: string) => completeInterview(interviewId),
    onSuccess,
    onError: (err: any) => {
      handleError(err, '인터뷰를 완료하는 중 문제가 발생했습니다.');
      onError(err);
    }
  });

  return {
    complete,
    isCompleting,
    error,
  };
};
