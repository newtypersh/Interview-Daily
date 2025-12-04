export function toHistoryResponseDto(interview) {
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