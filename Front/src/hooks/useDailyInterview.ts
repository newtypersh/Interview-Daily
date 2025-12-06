import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecording } from './useRecording';
import { useInterviewQuestions } from './useInterviewQuestions';

export const useDailyInterview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  
  const recording = useRecording();
  const { questions, isLoading, error } = useInterviewQuestions();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Reset recording when question changes (handled in handlers)

  const handlePrevQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      recording.reset();
    }
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      recording.reset();
    }
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;

    // Save current answer
    setAnswers({ ...answers, [currentQuestion.id]: 'Recorded answer' });

    if (isLastQuestion) {
      // Navigate to feedback page
      navigate('/daily-interview/feedback');
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      recording.reset();
    }
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: questions.length,
    isRecording: recording.isRecording,
    recordingStopped: recording.recordingStopped,
    isLastQuestion,
    isFirstQuestion,
    isLoading,
    error,
    handleStartRecording: recording.start,
    handleStopRecording: recording.stop,
    handleRetry: recording.reset,
    handlePrevQuestion,
    handleNextQuestion,
    handleSubmit,
  };
};
