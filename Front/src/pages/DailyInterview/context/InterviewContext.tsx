import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useRecording } from '../../../hooks/useRecording';
import { useInterviewQuestions } from '../../../hooks/useInterviewQuestions';
import { uploadAnswerAudio } from '../../../apis/interview';
import type { Question } from '../../../types';

interface InterviewContextType {
  // Data
  currentQuestion: Question | undefined;
  currentIndex: number;
  totalQuestions: number;
  interviewId: string | null;
  
  // Status
  isLoading: boolean;
  isSubmitting: boolean;
  error: Error | null;
  isRecording: boolean;
  recordingStopped: boolean;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;

  // Actions
  startRecording: () => void;
  stopRecording: () => void;
  retryRecording: () => void;
  toPrevQuestion: () => void;
  toNextQuestion: () => void;
  submitAnswer: () => Promise<void>;
}

const InterviewContext = createContext<InterviewContextType | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  const recording = useRecording();
  const { questions, interviewId, isLoading, error } = useInterviewQuestions();

  const currentQuestion = questions[currentIndex];
  // Calculate derived state
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = questions.length > 0 && currentIndex === questions.length - 1;

  // Mutation for uploading audio answer
  const { mutate: submitAudio, isPending: isSubmitting } = useMutation({
    mutationFn: async ({ id, blob }: { id: string; blob: Blob }) => {
      if (!interviewId) throw new Error('Interview ID is missing');
      return uploadAnswerAudio(interviewId, id, blob);
    },
    onSuccess: () => {
      if (isLastQuestion) {
        navigate('/daily-interview/feedback');
      } else {
        setCurrentIndex((prev) => prev + 1);
        recording.reset();
      }
    },
    onError: (err) => {
      console.error('Failed to submit answer:', err);
      alert('답변 제출에 실패했습니다. 다시 시도해주세요.');
    }
  });

  const handlePrevQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentIndex((prev) => prev - 1);
      recording.reset();
    }
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      recording.reset();
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion || !recording.mediaBlobUrl) return;

    try {
      const response = await fetch(recording.mediaBlobUrl);
      const blob = await response.blob(); 
      submitAudio({ id: currentQuestion.id, blob });
    } catch (err) {
      console.error('Error preparing audio for upload:', err);
    }
  };

  const value: InterviewContextType = {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    interviewId,
    isLoading,
    isSubmitting,
    error,
    isRecording: recording.isRecording,
    recordingStopped: recording.recordingStopped,
    isLastQuestion,
    isFirstQuestion,
    startRecording: recording.start,
    stopRecording: recording.stop,
    retryRecording: recording.reset,
    toPrevQuestion: handlePrevQuestion,
    toNextQuestion: handleNextQuestion,
    submitAnswer: handleSubmit,
  };

  return (
    <InterviewContext.Provider value={value}>
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
