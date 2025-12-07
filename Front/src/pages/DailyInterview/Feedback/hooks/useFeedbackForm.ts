import { useState, useEffect } from 'react';
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

export const useFeedbackForm = (questions: Question[], defaultContent?: string) => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Record<string, QuestionFeedback>>({});
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Initialize feedbacks or update them when defaultContent changes
  useEffect(() => {
    setFeedbacks(prev => {
      const newFeedbacks = { ...prev };
      let hasChanges = false;

      questions.forEach(q => {
        // If feedback for this question doesn't exist, create it
        if (!newFeedbacks[q.id]) {
          newFeedbacks[q.id] = { rating: 0, content: defaultContent || '' };
          hasChanges = true;
        } 
        // If it exists but content is empty and we have a defaultContent, update it
        else if (!newFeedbacks[q.id].content && defaultContent) {
          newFeedbacks[q.id] = { ...newFeedbacks[q.id], content: defaultContent };
          hasChanges = true;
        }
      });

      return hasChanges ? newFeedbacks : prev;
    });
  }, [questions, defaultContent]);


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
