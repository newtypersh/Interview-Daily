export function toFeedbackDto(f) {
  if (!f) return null;
  return {
    id: f.id != null ? String(f.id) : null,
    interviewAnswerId: f.interview_answer_id != null ? String(f.interview_answer_id) : null,
    questionId: f.question_id != null ? String(f.question_id) : null,
    rating: f.rating ?? null,
    feedbackText: f.feedback_text ?? null,
    createdAt: f.created_at ? f.created_at.toISOString() : null,
    updatedAt: f.updated_at ? f.updated_at.toISOString() : null,
  };
}