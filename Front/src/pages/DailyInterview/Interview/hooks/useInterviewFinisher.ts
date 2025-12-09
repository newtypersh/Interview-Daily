import { useNavigate } from 'react-router-dom';
import { useInterviewCompletion } from '../../../../react-query/mutation/DailyInterview/useInterviewCompletion';
import { handleError } from '../../../../utils/errorHandler';

export const useInterviewFinisher = () => {
  const navigate = useNavigate();

  const { complete, isCompleting } = useInterviewCompletion({
    onSuccess: (_: unknown, completedInterviewId: string) => {
      navigate('/daily-interview/feedback', {
        state: { interviewId: completedInterviewId },
      });
    },
    onError: handleError,
  });

  return { 
    complete,
    isFinishing: isCompleting 
  };
};
