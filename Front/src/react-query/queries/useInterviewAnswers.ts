import { useQuery } from '@tanstack/react-query';
import { getInterviewAnswers } from '../../apis/interview';

export const useInterviewAnswers = (interviewId: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['interview', interviewId, 'answers'],
    queryFn: () => getInterviewAnswers(interviewId!),
    enabled: !!interviewId,
    staleTime: 0, // Always fetch fresh data on mount (to get latest STT)
  });

  return {
    interview: data,
    isPending,
    error,
  };
};
