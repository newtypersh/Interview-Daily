import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeedbackFormSchema, type FeedbackFormValues, type FeedbackFormItem, DEFAULT_FEEDBACK_ITEM } from '../schemas/form';
import type { FeedbackItem } from '../utils/feedbackMapper';

// Zod 스키마에서 추론된 타입 사용
export type QuestionFeedback = FeedbackFormItem;


/**
 * 오디오 재생 상태 관리 Hook
 */
const useFeedbackAudio = () => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handlePlayAudio = (questionId: string) => {
    if (playingAudio === questionId) {
      setPlayingAudio(null);
      // TODO: Stop audio playback logic here
    } else {
      setPlayingAudio(questionId);
      // TODO: Start audio playback logic here
      setTimeout(() => setPlayingAudio(null), 3000); 
    }
  };

  return { playingAudio, handlePlayAudio };
};

/**
 * 초기 피드백 데이터 생성 Helper
 */
const getInitialFeedbacks = (feedbackItems: FeedbackItem[], defaultContent?: string): Record<string, FeedbackFormItem> => {
  const initialFeedbacks: Record<string, FeedbackFormItem> = {};

  feedbackItems.forEach((q) => {
    if (q.feedbacks && q.feedbacks.length > 0) {
      // 1. 서버에 저장된 피드백이 있는 경우
      const fb = q.feedbacks[0];
      initialFeedbacks[q.id] = { 
        rating: fb.rating, 
        content: fb.feedbackText || defaultContent || '' 
      };
    } else {
      // 2. 새로운 피드백 (기본값)
      initialFeedbacks[q.id || ''] = { 
        ...DEFAULT_FEEDBACK_ITEM,
        content: defaultContent || DEFAULT_FEEDBACK_ITEM.content 
      };
    }
  });

  return initialFeedbacks;
};

export const useFeedbackForm = (feedbackItems: FeedbackItem[], defaultContent?: string) => {
  // 1. Audio Logic
  const { playingAudio, handlePlayAudio } = useFeedbackAudio();

  // 2. Form Logic
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues: { feedbacks: {} },
    mode: 'onBlur', 
  });

  const { reset } = form;
  const loadedIdsRef = useRef<string>('');

  // 3. Initialization Effect
  useEffect(() => {
    if (feedbackItems.length === 0) return;

    // 데이터 갱신 여부 확인 (Signature Pattern)
    const currentIdsSignature = feedbackItems.map(q => q.id).join(',');
    
    // 이미 로드된 데이터셋이면 스킵 (사용자 입력 유지)
    if (loadedIdsRef.current === currentIdsSignature) {
        return;
    }
    
    loadedIdsRef.current = currentIdsSignature;

    // 초기값 계산 및 리셋
    const initialValues = getInitialFeedbacks(feedbackItems, defaultContent);
    reset({ feedbacks: initialValues });
    
  }, [feedbackItems, defaultContent, reset]);

  return {
    form,
    playingAudio,
    handlePlayAudio,
  };
};
