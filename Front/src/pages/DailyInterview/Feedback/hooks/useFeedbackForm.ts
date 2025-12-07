import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface QuestionFeedback {
  rating: number;
  content: string;
}

export interface Question {
  id: string;
  content: string;
  order: number;
  transcript?: string;
  audioUrl?: string | null;
}

export const useFeedbackForm = (questions: Question[]) => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Record<string, QuestionFeedback>>(
    questions.reduce((acc, q) => ({
      ...acc,
      [q.id]: { rating: 0, content: '' }
    }), {})
  );
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handleRatingChange = (questionId: string, rating: number | null) => {
    setFeedbacks({
      ...feedbacks,
      [questionId]: { ...feedbacks[questionId], rating: rating || 0 }
    });
  };

  const handleContentChange = (questionId: string, content: string) => {
    setFeedbacks({
      ...feedbacks,
      [questionId]: { ...feedbacks[questionId], content }
    });
  };

  const handlePlayAudio = (questionId: string) => {
    if (playingAudio === questionId) {
      setPlayingAudio(null);
      // TODO: Stop audio playback
    } else {
      setPlayingAudio(questionId);
      // TODO: Start audio playback
      // 실제 구현 시에는 녹음된 오디오를 재생
      setTimeout(() => setPlayingAudio(null), 3000); // 임시로 3초 후 자동 정지
    }
  };

  const handleSubmit = () => {
    // TODO: Save feedbacks to backend
    console.log('Feedbacks:', feedbacks);
    navigate('/');
  };

  return {
    feedbacks,
    playingAudio,
    handleRatingChange,
    handleContentChange,
    handlePlayAudio,
    handleSubmit,
  };
};
