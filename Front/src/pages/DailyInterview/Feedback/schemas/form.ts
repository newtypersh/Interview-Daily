import { z } from 'zod';
import { FeedbackItemSchema } from '../../../../schemas/feedback';

// Form 전용 아이템 스키마: rating 0 허용 (미입력 상태)
export const FeedbackFormItemSchema = FeedbackItemSchema.extend({
  rating: z.number().int().min(0).max(5),
}).refine(
  (data) => {
    // 내용이 작성되었다면 평점은 0점일 수 없음 (최소 1점)
    if (data.content.trim().length > 0) {
      return data.rating > 0;
    }
    return true;
  },
  {
    message: '내용을 작성했다면 평점을 선택해주세요.',
    path: ['rating'],
  }
);

export const FeedbackFormSchema = z.object({
  feedbacks: z.record(z.string(), FeedbackFormItemSchema),
}).refine(
  (data) => Object.values(data.feedbacks).some((item) => item.rating > 0),
  {
    message: '평가를 완료하고 싶은 항목에 점수를 매겨주세요.',
    path: ['root'], // root 에러로 설정
  }
);

export const DEFAULT_FEEDBACK_ITEM: z.infer<typeof FeedbackFormItemSchema> = {
  rating: 0,
  content: '',
};

export type FeedbackFormItem = z.infer<typeof FeedbackFormItemSchema>;
export type FeedbackFormValues = z.infer<typeof FeedbackFormSchema>;
