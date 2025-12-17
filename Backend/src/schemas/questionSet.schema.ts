import { z } from "zod";

const QuestionCategoryEnum = z.enum(["JOB", "PERSONAL", "MOTIVATION"]);

export const createQuestionSetSchema = z.object({
  body: z.object({
        name: z.string()
      .trim()
      .min(1, "name(1~20자)이 필요합니다.")
      .max(20, "name은 최대 20자입니다."),
    category: QuestionCategoryEnum.optional(), 
  }),
});

export const createQuestionSetSchemaStrict = z.object({
  body: z.object({
    name: z.string()
      .trim()
      .min(1, "name(1~20자)이 필요합니다.")
      .max(20, "name은 최대 20자입니다."),
    category: QuestionCategoryEnum,
  }),
});

export const updateQuestionSetSchema = z.object({
  params: z.object({
    setId: z.string().transform(Number).refine(n => !isNaN(n), { message: "setId는 숫자여야 합니다." }),
  }),
  body: z.object({
    name: z.string().trim().min(1).max(20).optional(),
    category: QuestionCategoryEnum.optional(),
  }).refine(data => Object.keys(data).length > 0, { message: "수정할 필드를 하나 이상 제공하세요." }),
});

export const createQuestionSchema = z.object({
  params: z.object({
    setId: z.string().transform(Number).refine(n => !isNaN(n), { message: "setId는 숫자여야 합니다." }),
  }),
  body: z.object({
    content: z.string().trim().min(1, "content가 필요합니다."),
    order: z.number().or(z.string().transform(Number)).optional(),
  }),
});

export const updateQuestionSchema = z.object({
  params: z.object({
    setId: z.string().transform(Number).refine(n => !isNaN(n), { message: "setId는 숫자여야 합니다" }),
    questionId: z.string().transform(Number).refine(n => !isNaN(n), { message: "setId와 questionId는 숫자여야 합니다" }),
  }),
  body: z.object({
    content: z.string().trim().min(1, "content가 비어있습니다.").optional(),
    order: z.number().or(z.string().transform(Number)).optional(),
  }).refine(data => Object.keys(data).length > 0, { message: "수정할 필드를 하나 이상 제공하세요." }),
});
