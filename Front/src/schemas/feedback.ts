import { z } from 'zod';

export const FeedbackItemSchema = z.object({
  rating: z.number().int().min(1, '최소 1점 이상 선택해주세요.').max(5),
  content: z.string().max(1000, '피드백은 1000자 이내로 작성해주세요.'),
});

// 전체 피드백 제출 스키마
export const FeedbackSubmissionSchema = z.object({
  interviewId: z.string().uuid().or(z.string().min(1)), // UUID가 아닐 수도 있으니 최소 길이만 체크
  feedbacks: z.record(z.string(), FeedbackItemSchema).refine(
    (data) => Object.keys(data).length > 0,
    { message: '최소 하나 이상의 피드백을 작성해야 합니다.' }
  ),
});

export type FeedbackItem = z.infer<typeof FeedbackItemSchema>;
// Form에서 사용하는 State용 타입
export type FeedbackState = Record<string, FeedbackItem>;
