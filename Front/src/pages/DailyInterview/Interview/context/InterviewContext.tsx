import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useInterviewFlow } from '../hooks/useInterviewFlow';
import { handleError } from '../../../../utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import type { InterviewContextType } from '../../../../types';


const InterviewContext = createContext<InterviewContextType | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleComplete = useCallback(() => {
    navigate('/daily-interview/feedback');
  }, [navigate]);

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
