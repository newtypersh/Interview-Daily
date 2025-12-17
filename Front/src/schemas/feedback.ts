import { z } from 'zod';

export const FeedbackItemSchema = z.object({
  rating: z.number().int().min(1, '최소 1점 이상 선택해주세요.').max(5),
  content: z.string().max(1000, '피드백은 1000자 이내로 작성해주세요.'),
});

// 전체 피드백 제출 스키마 (Form State Validation)
export const FeedbackSubmissionSchema = z.object({
  interviewId: z.string().uuid().or(z.string().min(1)), 
  feedbacks: z.record(z.string(), FeedbackItemSchema).refine(
    (data) => Object.keys(data).length > 0,
    { message: '최소 하나 이상의 피드백을 작성해야 합니다.' }
  ),
});

// API Schemas
export const FeedbackSubmissionItemSchema = z.object({
  answerId: z.string(),
  rating: z.number(),
  feedbackText: z.string(),
});

export const FeedbackSubmissionRequestSchema = z.object({
  feedbacks: z.array(FeedbackSubmissionItemSchema),
});

export const FeedbackSubmissionResultSchema = z.object({
  message: z.string(),
  count: z.number(),
});

export const FeedbackSubmissionResponseSchema = z.object({
  resultType: z.string(),
  success: FeedbackSubmissionResultSchema,
  error: z.any().nullable().optional(),
});

export type FeedbackItem = z.infer<typeof FeedbackItemSchema>;
// Form에서 사용하는 State용 타입
export type FeedbackState = Record<string, FeedbackItem>;
export type FeedbackSubmissionItem = z.infer<typeof FeedbackSubmissionItemSchema>;
export type FeedbackSubmissionRequest = z.infer<typeof FeedbackSubmissionRequestSchema>;
export type FeedbackSubmissionResult = z.infer<typeof FeedbackSubmissionResultSchema>;
export type FeedbackSubmissionResponse = z.infer<typeof FeedbackSubmissionResponseSchema>;
