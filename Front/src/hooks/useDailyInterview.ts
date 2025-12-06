import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useRecording } from './useRecording';
import { useInterviewQuestions } from './useInterviewQuestions';
import { uploadAnswerAudio } from '../apis/interview';

export const useDailyInterview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();
  
  const recording = useRecording();
  const { questions, interviewId, isLoading, error } = useInterviewQuestions();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Mutation for uploading audio answer
  const { mutate: submitAudio, isPending: isSubmitting } = useMutation({
    mutationFn: async ({ id, blob }: { id: string; blob: Blob }) => {
      if (!interviewId) throw new Error('Interview ID is missing');
      return uploadAnswerAudio(interviewId, id, blob);
    },
    onSuccess: () => {
      // Proceed after successful upload
      if (isLastQuestion) {
        navigate('/daily-interview/feedback');
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        recording.reset();
      }
    },
    onError: (err) => {
      console.error('Failed to submit answer:', err);
      // Optional: Add toast or error handling here
      alert('답변 제출에 실패했습니다. 다시 시도해주세요.');
    }
  });

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

  const handleSubmit = async () => {
    if (!currentQuestion || !recording.mediaBlobUrl) return;

    try {
      // Fetch the blob from the blob URL
      const response = await fetch(recording.mediaBlobUrl);
      const blob = await response.blob(); 
      
      // Upload execution
      submitAudio({ id: currentQuestion.id, blob });
      
    } catch (err) {
      console.error('Error preparing audio for upload:', err);
    }
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: questions.length,
    interviewId,
    isRecording: recording.isRecording,
    recordingStopped: recording.recordingStopped,
    isLastQuestion,
    isFirstQuestion,
    isLoading,
    isSubmitting, // Expose for UI loading state if needed
    error,
    handleStartRecording: recording.start,
    handleStopRecording: recording.stop,
    handleRetry: recording.reset,
    handlePrevQuestion,
    handleNextQuestion,
    handleSubmit,
  };
};
