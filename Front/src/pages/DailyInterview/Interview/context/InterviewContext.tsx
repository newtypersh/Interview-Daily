import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewFlow } from '../hooks/useInterviewFlow';
import { useInterviewCompletion } from '../../../../react-query/mutation/DailyInterview/useInterviewCompletion';
import { handleError } from '../../../../utils/errorHandler';
import type { InterviewContextType } from '../../../../types';

const InterviewContext = createContext<InterviewContextType | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleSuccess = useCallback((interviewId?: string) => {
    navigate('/daily-interview/feedback', {
      state: { interviewId }
    });
  }, [navigate]);

  const { complete } = useInterviewCompletion({
    onSuccess: (_, variables) => handleSuccess(variables),
    onError: handleError,
  });

  const handleComplete = useCallback((interviewId: string) => {
    complete(interviewId);
  }, [complete]);

  const interviewLogic = useInterviewFlow({
    onComplete: handleComplete,
    onError: handleError,
  });

  return (
    <InterviewContext.Provider value={interviewLogic}>
      {children}
    </InterviewContext.Provider>
  );
}

export const useInterviewContext = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterviewContext must be used within an InterviewProvider');
  }
  return context;
};
