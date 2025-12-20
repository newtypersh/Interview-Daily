import { z } from 'zod';

export const InterviewHistoryItemSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  totalScore: z.number(),
  questionCount: z.number(),
});

export const InterviewHistoryResponseSchema = z.object({
  resultType: z.string(),
  success: z.object({
    data: z.array(InterviewHistoryItemSchema),
    pagination: z.object({
      nextCursorCreatedAt: z.string().nullable(),
      hasNext: z.boolean(),
    }),
  }),
  error: z.any().nullable().optional(),
});

export type InterviewHistoryItem = z.infer<typeof InterviewHistoryItemSchema>;
export type InterviewHistoryResponse = z.infer<typeof InterviewHistoryResponseSchema>;
export type InterviewHistoryData = InterviewHistoryResponse['success'];
