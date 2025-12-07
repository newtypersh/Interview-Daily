import { useQuery } from '@tanstack/react-query';
import { getInterviewAnswers } from '../../apis/interview';
import type { InterviewDto } from '../../types';

export const useInterviewAnswers = (interviewId: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['interview', interviewId, 'answers'],
    queryFn: () => getInterviewAnswers(interviewId!),
    enabled: !!interviewId,
    staleTime: 0, // Always fetch fresh data on mount (to get latest STT)
  });

  return {
    interview: data as InterviewDto | undefined,
    isLoading,
    error,
  };
};
