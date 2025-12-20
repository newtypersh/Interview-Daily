import { z } from "zod";

export const getInterviewHistorySchema = z.object({
  query: z.object({
    limit: z.string().transform(Number).or(z.number()).pipe(z.number().min(1).max(100)).default(20),
    cursorCreatedAt: z.string().optional(),
  }),
});
