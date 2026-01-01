import { z } from 'zod';
import { FeedbackItemSchema } from '../../../../schemas/feedback';

// Form 전용 아이템 스키마: rating 0 허용 (미입력 상태)
export const FeedbackFormItemSchema = FeedbackItemSchema.extend({
  rating: z.number().int().min(0).max(5),
  answerId: z.string(), // 답변 식별자 추가
});

// 입력값 타입 (useForm에서 사용)
export const FeedbackFormInputSchema = z.object({
  feedbacks: z.record(z.string(), FeedbackFormItemSchema),
}).superRefine((data, ctx) => {
  let hasError = false;
  Object.entries(data.feedbacks).forEach(([key, item]) => {
    if (item.rating === 0) {
      hasError = true;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '평가를 완료해주세요.',
        path: ['feedbacks', key, 'rating'], // 구체적인 항목 위치로 에러 지정
      });
    }
  });
  
  // 전체 에러도 필요한 경우 추가 (선택 사항, 현재는 개별 항목 에러로 충분할 수 있음)
  if (hasError) {
     ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '평가하지 않은 항목이 있습니다.',
        path: ['root'],
     });
  }
});

// 최종 제출용 스키마 (변환 로직 포함)
export const FeedbackFormSchema = FeedbackFormInputSchema.transform((data) => {
  return {
    feedbacks: Object.values(data.feedbacks)
      .filter((item) => item.rating > 0)
      .map((item) => ({
        answerId: item.answerId,
        rating: item.rating,
        feedbackText: item.content,
      })),
  };
});

export const DEFAULT_FEEDBACK_ITEM: z.infer<typeof FeedbackFormItemSchema> = {
  rating: 0,
  content: '',
  answerId: '',
};

export type FeedbackFormItem = z.infer<typeof FeedbackFormItemSchema>;
// Form State (Input) 타입
export type FeedbackFormValues = z.input<typeof FeedbackFormSchema>;
// Transformed Output 타입 (Submission)
export type FeedbackSubmissionValues = z.output<typeof FeedbackFormSchema>;
