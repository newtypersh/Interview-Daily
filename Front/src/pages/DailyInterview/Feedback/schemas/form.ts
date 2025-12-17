import { z } from 'zod';
import { FeedbackItemSchema } from '../../../../schemas/feedback';

export const FeedbackFormSchema = z.object({
  feedbacks: z.record(z.string(), FeedbackItemSchema),
});

export type FeedbackFormValues = z.infer<typeof FeedbackFormSchema>;
