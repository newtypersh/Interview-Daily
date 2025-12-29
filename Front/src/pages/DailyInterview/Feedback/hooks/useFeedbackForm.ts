import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeedbackFormInputSchema, type FeedbackFormValues, type FeedbackFormItem, DEFAULT_FEEDBACK_ITEM } from '../schemas/form';
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
        content: fb.feedbackText || defaultContent || '',
        answerId: q.answerId,
      };
    } else {
      // 2. 새로운 피드백 (기본값)
      initialFeedbacks[q.id || ''] = { 
        ...DEFAULT_FEEDBACK_ITEM,
        content: defaultContent || DEFAULT_FEEDBACK_ITEM.content,
        answerId: q.answerId,
      };
    }
  });

  return initialFeedbacks;
};

export const useFeedbackForm = (feedbackItems: FeedbackItem[], defaultContent?: string) => {
  // 1. Audio Logic
  const { playingAudio, handlePlayAudio } = useFeedbackAudio();

  // 2. Form Logic
  // 데이터 갱신 여부 확인 (Signature Pattern) -> ID 조합이 바뀔 때만 초기값 재계산
  const idsSignature = feedbackItems.map(q => q.id).join(',');
  
  const defaultValues = useMemo(() => {
    if (feedbackItems.length === 0) return { feedbacks: {} };
    
    const initialValues = getInitialFeedbacks(feedbackItems, defaultContent);
    return { feedbacks: initialValues };
    // feedbackItems가 바뀌더라도 idsSignature가 같으면(즉, 같은 질문셋이면) 재계산하지 않음
  }, [idsSignature, defaultContent]);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackFormInputSchema), // Use InputSchema for validation only (no transform here)
    values: defaultValues, // 값이 변경되면 폼이 업데이트됨 (reset 효과)
    mode: 'onBlur', 
  });

  return {
    form,
    playingAudio,
    handlePlayAudio,
  };
};
