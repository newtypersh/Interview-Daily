import { z } from 'zod';

export const FeedbackCategorySchema = z.enum(['JOB', 'PERSONAL', 'MOTIVATION']);

export const FeedbackTemplateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  category: FeedbackCategorySchema,
  templateText: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GetFeedbackTemplatesResponseSchema = z.object({
  resultType: z.string(),
  success: z.object({
    templates: z.array(FeedbackTemplateSchema),
  }),
  error: z.any().nullable().optional(),
});

export const UpdateFeedbackTemplateRequestSchema = z.object({
  category: FeedbackCategorySchema,
  content: z.string(),
});

export const UpdateFeedbackTemplateResponseSchema = z.object({
  resultType: z.string(),
  success: z.object({
    template: FeedbackTemplateSchema,
  }),
  error: z.any().nullable().optional(),
});

export type FeedbackTemplate = z.infer<typeof FeedbackTemplateSchema>;
export type GetFeedbackTemplatesResponse = z.infer<typeof GetFeedbackTemplatesResponseSchema>;
export type UpdateFeedbackTemplateRequest = z.infer<typeof UpdateFeedbackTemplateRequestSchema>;
export type UpdateFeedbackTemplateResponse = z.infer<typeof UpdateFeedbackTemplateResponseSchema>;
