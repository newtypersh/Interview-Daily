import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeedbackFormInputSchema, type FeedbackFormValues, type FeedbackFormItem, DEFAULT_FEEDBACK_ITEM } from '../schemas/form';
import type { FeedbackItem } from '../utils/feedbackMapper';
import { useFeedbackSubmission } from './useFeedbackSubmission';

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

/**
 * 폼 초기값 계산 Hook
 */
const useFeedbackDefaultValues = (feedbackItems: FeedbackItem[], defaultContent?: string) => {
  // 데이터 갱신 여부 확인 (Signature Pattern) -> ID 조합이 바뀔 때만 초기값 재계산
  const idsSignature = feedbackItems.map(q => q.id).join(',');
  
  return useMemo(() => {
    if (feedbackItems.length === 0) return { feedbacks: {} };
    
    const initialValues = getInitialFeedbacks(feedbackItems, defaultContent);
    return { feedbacks: initialValues };
    // feedbackItems가 바뀌더라도 idsSignature가 같으면(즉, 같은 질문셋이면) 재계산하지 않음
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsSignature, defaultContent]);
};



export const useFeedbackForm = (feedbackItems: FeedbackItem[], interviewId: string, defaultContent?: string) => {
  // 1. Initial Values Logic
  const defaultValues = useFeedbackDefaultValues(feedbackItems, defaultContent);

  // 2. Audio Logic
  const { playingAudio, handlePlayAudio } = useFeedbackAudio();

  // 3. Form Logic
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackFormInputSchema), // Hook에서 유효성 검사 수행
    values: defaultValues, // 값이 변경되면 폼이 업데이트됨 (reset 효과)
  });

  // 4. Submission Logic
  const { onSubmit, isSubmitting } = useFeedbackSubmission({ interviewId });

  // form.handleSubmit을 호출하면, 데이터 검사 후 onSubmit에 전달
  const submitHandler = form.handleSubmit(onSubmit, (errors) => {
    if (errors.root) {
      alert(errors.root.message);
    }
  });


  return {
    control: form.control,
    playingAudio,
    handlePlayAudio,
    submitHandler,
    isSubmitting,
  };
};
