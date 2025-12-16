import { Interview, InterviewAnswer, Feedback } from "@prisma/client";

type InterviewHistoryInput = {
    id: bigint;
    created_at: Date;
    _count?: {
        answers: number;
    } | null;
    answers?: {
        feedbacks?: { rating: number }[];
    }[];
};

export function toHistoryResponseDto(interview: InterviewHistoryInput | null) {
  if (!interview) return null;

  const totalScore = interview.answers?.reduce((sum, answer) => {
      const answerScore = answer.feedbacks?.reduce((fSum, feedback) => fSum + (feedback.rating || 0), 0) || 0;
      return sum + answerScore;
  }, 0) || 0;

  return {
    id: String(interview.id),
    createdAt: interview.created_at ? interview.created_at.toISOString() : null,
    totalScore: totalScore,
    questionCount: interview._count?.answers || 0,
  };
}