import { useQuery } from '@tanstack/react-query';
import { getInterviewAnswers } from '../../apis/interview';

type UseTranscriptProps = {
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
      
      const interview = query.state.data;
      const answer = interview.answers.find(a => a.id === answerId);
      
      // Stop polling if we have a non-empty transcript
      if (answer?.transcriptText && answer.transcriptText.length > 0) {
        return false;
      }
      return 1000;
    },
  });

  const transcript = interviewId && answerId && interviewData
    ? interviewData.answers.find(a => a.id === answerId)?.transcriptText || ''
    : '';

  // answerId가 존재하고, 텍스트가 없을 때, true
  // !! (이중 부정) = 뒤집고 다시 뒤집기 = boolean으로 만들기
  const isTranscribing = !!answerId && !transcript;

  return {
    transcript,
    isTranscribing,
    error,
  };
};
