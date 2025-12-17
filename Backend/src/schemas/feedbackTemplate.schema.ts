import { z } from "zod";

const CategoryEnum = z.enum(["JOB", "PERSONAL", "MOTIVATION"]);

export const getFeedbackTemplatesByCategorySchema = z.object({
  params: z.object({
    category: CategoryEnum,
  }),
});

export const updateFeedbackTemplateSchema = z.object({
  params: z.object({
    category: CategoryEnum,
  }),
  body: z.object({
    content: z.string().trim().max(1000, "content는 최대 1000자까지 가능합니다."),
  }),
});
