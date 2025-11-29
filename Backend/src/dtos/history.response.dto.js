export function toHistoryResponseDto(interview) {
  if (!interview) return null;

  return {
    id: String(interview.id),
    userId: String(interview.user_id),
    questionSetId: interview.question_set_id ? String(interview.question_set_id) : null,
    day: interview.day ? interview.day.toISOString() : null,
    interviewedAt: interview.interviewed_at ? interview.interviewed_at.toISOString() : null,
    createdAt: interview.created_at ? interview.created_at.toISOString() : null,

    answers: Array.isArray(interview.answers)
        ? interview.answers.map(toAnswerResponseDto)
        : [],
  };
}

function toAnswerResponseDto(answer) {
    if (!answer) return null;

    return {
        id: String(answer.id),
        questionId: answer.question_id ? String(answer.question_id) : null,
        sequence: answer.sequence ?? null,
        audioUrl: answer.audio_url ?? null,
        content: answer.content ?? null,
        createdAt: answer.created_at ? answer.created_at.toISOString() : null,
    };
}