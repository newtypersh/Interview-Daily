import { useState, useCallback } from 'react';

interface UseInterviewSessionProps {
  totalQuestions: number;
}

export const useInterviewSession = ({ totalQuestions }: UseInterviewSessionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = totalQuestions > 0 && currentIndex === totalQuestions - 1;

  const toNextQuestion = useCallback(() => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLastQuestion]);

  const toPrevQuestion = useCallback(() => {
    if (!isFirstQuestion) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [isFirstQuestion]);

  return {
    currentIndex,
    isFirstQuestion,
    isLastQuestion,
    toNextQuestion,
    toPrevQuestion,
  };
};
