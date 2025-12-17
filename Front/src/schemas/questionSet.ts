import { z } from 'zod';

export const QuestionCategorySchema = z.enum(['JOB', 'PERSONAL', 'MOTIVATION']);

export const QuestionSchema = z.object({
  id: z.string(),
  questionSetId: z.string(),
  content: z.string().nullable(),
  order: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const QuestionSetSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  category: QuestionCategorySchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  questions: z.array(QuestionSchema).optional(),
});

export type QuestionSet = z.infer<typeof QuestionSetSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionCategory = z.infer<typeof QuestionCategorySchema>;
