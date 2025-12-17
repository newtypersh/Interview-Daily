import { z } from "zod";

const StrategyEnum = z.enum(["random", "JOB", "PERSONAL", "MOTIVATION"]);

export const startInterviewSchema = z.object({
  body: z.object({
    // default value is "random"
    // strategy 필드는 StrategyEnum에 정의된 값 중 하나
    strategy: StrategyEnum.default("random"),
  }),
});

export const getInterviewSchema = z.object({
  params: z.object({
    // refine은 변환된 값이 숫자인지 확인하는데 사용
    interviewId: z.string().transform(Number).refine((n) => !isNaN(n), { message: "interviewId는 숫자여야 합니다." }),
  }),
});

export const getInterviewAnswersSchema = z.object({
    params: z.object({
      interviewId: z.string().transform(Number).refine((n) => !isNaN(n), { message: "interviewId는 숫자여야 합니다." }),
    }),
});

export const submitFeedbacksSchema = z.object({
  params: z.object({
    interviewId: z.string().transform(Number).refine((n) => !isNaN(n), { message: "interviewId는 숫자여야 합니다." }),
  }),
  body: z.object({
    feedbacks: z.array(z.object({
        answerId: z.number().or(z.string().transform(Number)),
        rating: z.number().min(1, "점수는 1 이상이어야 합니다.").max(5, "점수는 5 이하이어야 합니다."),
        comment: z.string().optional(),
    }))
    .min(1, "피드백 데이터가 올바르지 않습니다."),
  }),
});

export const uploadAnswerAudioSchema = z.object({
    params: z.object({
      interviewId: z.string().transform(Number).refine((n) => !isNaN(n), { message: "interviewId는 숫자여야 합니다." }),
      answerId: z.string().transform(Number).refine((n) => !isNaN(n), { message: "answerId는 숫자여야 합니다." }),
    }),
});

export const completeInterviewSchema = z.object({
    params: z.object({
      interviewId: z.string().transform(Number).refine((n) => !isNaN(n), { message: "interviewId는 숫자여야 합니다." }),
    }),
});
