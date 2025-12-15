import { useState, useCallback } from 'react';
import type { Question } from '../../../../apis/questionSet/types';

type UseInterviewSessionProps = {
  questions: Question[];
}

export const useInterviewSession = ({ questions }: UseInterviewSessionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  
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
    totalQuestions,
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,
    toNextQuestion,
    toPrevQuestion,
  };
};
