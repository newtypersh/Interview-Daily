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
})
// superRefine: 단순 필드 제약을 넘어선 커스텀 유효성 검증을 수행합니다.
// 데이터 전체(data)에 접근 가능하여, 여러 필드를 조합해서 검사하거나 조건부 에러를 발생시킬 수 있습니다.
.superRefine((data, ctx) => {
  let hasError = false;

  // 모든 피드백 항목을 순회하며 검사
  Object.entries(data.feedbacks).forEach(([key, item]) => {
    // rating이 0(미선택)인 경우
    if (item.rating === 0) {
      hasError = true;
      
      // ctx.addIssue: 유효성 검사 실패 사실을 Zod에 알립니다.
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // 커스텀 에러 코드
        message: '평가를 완료해주세요.', 
        // path: 에러가 발생한 데이터의 정확한 경로를 배열로 지정합니다.
        // 예: ['feedbacks', 'q1', 'rating'] -> React Hook Form이 해당 path의 input에 에러를 바인딩합니다.
        path: ['feedbacks', key, 'rating'], 
      });
    }
  });
  
  // 필요 시 폼 전체(root) 레벨에 에러를 추가할 수도 있습니다.
  if (hasError) {
     ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '평가하지 않은 항목이 있습니다.',
        path: ['root'], // setError('root')와 동일한 효과
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
