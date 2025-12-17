import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeedbackFormSchema, type FeedbackFormValues } from '../schemas/form';
import type { Question as ApiQuestion } from '../../../../schemas/questionSet.ts';

export type QuestionFeedback = {
    rating: number;
    content: string;
}

export type Question = Partial<ApiQuestion> & {
  id: string;
  content: string;
  transcript?: string;
  audioUrl?: string | null;
  answerId?: string;
  feedbacks?: { rating: number; feedbackText?: string }[];
};

export const useFeedbackForm = (questions: Question[], defaultContent?: string) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues: {
      feedbacks: {},
    },
    mode: 'onBlur', 
  });

  const { reset } = form;

  // Initialize form values when questions or defaultContent changes
  useEffect(() => {
    if (questions.length === 0) return;

    const initialFeedbacks: Record<string, QuestionFeedback> = {};

    questions.forEach(q => {
      // If feedback exists in the question data (from backend), use it
      if (q.feedbacks && q.feedbacks.length > 0) {
        const fb = q.feedbacks[0];
        initialFeedbacks[q.id] = { 
          rating: fb.rating, 
          content: fb.feedbackText || defaultContent || '' 
        };
      } else {
        // Default init
        initialFeedbacks[q.id] = { rating: 0, content: defaultContent || '' };
      }
    });

    reset({ feedbacks: initialFeedbacks });
  }, [questions, defaultContent, reset]);


  const handlePlayAudio = (questionId: string) => {
    if (playingAudio === questionId) {
      setPlayingAudio(null);
      // TODO: Stop audio playback
    } else {
      setPlayingAudio(questionId);
      // TODO: Start audio playback
      setTimeout(() => setPlayingAudio(null), 3000); 
    }
  };

  return {
    form,
    playingAudio,
    handlePlayAudio,
  };
};
