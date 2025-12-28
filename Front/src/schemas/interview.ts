import { z } from 'zod';

export const InterviewStatusSchema = z.enum(['IN_PROGRESS', 'COMPLETED']);

export const InterviewFeedbackSchema = z.object({
  rating: z.number(),
  feedbackText: z.string().optional(),
});

export const InterviewAnswerSchema = z.object({
  id: z.string(),
  interviewId: z.string(),
  questionId: z.string(),
  sequence: z.number(),
  audioUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Hydrated fields
  questionContent: z.string().nullable().optional(),
  transcriptText: z.string().nullable().optional(),
  feedbacks: z.array(InterviewFeedbackSchema).optional(),
});

export const InterviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  questionSetId: z.string(),
  category: z.string().optional(), // 'JOB' | 'PERSONAL' | 'MOTIVATION' but defined as string in type ??
  status: InterviewStatusSchema,
  day: z.string().nullable(),
  interviewedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  answers: z.array(InterviewAnswerSchema),
});

export const StartInterviewResponseSchema = z.object({
  resultType: z.string(),
  success: z.object({
    interview: InterviewSchema,
  }),
  error: z.any().optional(),
});

export const UploadAudioResponseSchema = z.object({
  answer: z.object({
    id: z.string(),
    audioUrl: z.string(),
    transcriptText: z.string().nullable().optional(),
  }),
});

export const CompleteInterviewAnswerSchema = z.object({
  id: z.string(),
  sequence: z.number(),
  question: z.string(),
  audioUrl: z.string().nullable(),
  transcript: z.string().nullable().optional(),
  feedbacks: z.array(InterviewFeedbackSchema),
});

export const CompleteInterviewResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  category: z.string(),
  answers: z.array(CompleteInterviewAnswerSchema),
  templates: z.array(z.object({
    id: z.string(),
    content: z.string(),
  })),
});

export type Interview = z.infer<typeof InterviewSchema>;
export type InterviewAnswer = z.infer<typeof InterviewAnswerSchema>;
export type StartInterviewResponse = z.infer<typeof StartInterviewResponseSchema>;
export type UploadAudioResponse = z.infer<typeof UploadAudioResponseSchema>;
export type CompleteInterviewResponse = z.infer<typeof CompleteInterviewResponseSchema>;
