import { useQuery } from '@tanstack/react-query';
import { getInterviewAnswers } from '../../apis/interview';
import type { InterviewDto } from '../../types';

interface UseTranscriptProps {
  interviewId: string | null;
  answerId: string | null;
}

export const useTranscript = ({ interviewId, answerId }: UseTranscriptProps) => {
  const { data: interviewData, error } = useQuery({
    queryKey: ['interview', interviewId, 'answers'],
    queryFn: () => getInterviewAnswers(interviewId!),
    enabled: !!interviewId && !!answerId,
    refetchInterval: (query) => {
      if (!query.state.data) return 1000;
      
      const interview = query.state.data as InterviewDto;
      const answer = interview.answers.find(a => a.id === answerId);
      
      // Stop polling if we have a non-empty transcript
      if (answer?.transcriptText && answer.transcriptText.length > 0) {
        return false;
      }
      return 1000;
    },
  });

  const transcript = interviewId && answerId && interviewData
    ? (interviewData as InterviewDto).answers.find(a => a.id === answerId)?.transcriptText || ''
    : '';

  const isTranscribing = !!answerId && !transcript;

  return {
    transcript,
    isTranscribing,
    error,
  };
};
