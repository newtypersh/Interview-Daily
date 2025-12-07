import { BadRequestError, UnauthorizedError } from "../errors.js";

export function toInterviewAnswerDto(a) {
    if (!a) return null;
    return {
        id: a.id != null ? String(a.id) : null,
        interviewId: a.interviewId != null ? String(a.interviewId) : null,
        questionId: a.question_id != null ? String(a.question_id) : null,
        sequence: a.sequence ?? null,
        audioUrl: a.audio_url ?? null,
        createdAt: a.created_at ? a.created_at.toISOString() : null,
        updatedAt: a.updated_at ? a.updated_at.toISOString() : null,
        questionContent: a.question?.content ?? null,
        transcriptText: a.transcript_text ?? null,
    };
}

export function toInterviewDto(i) {
    if (!i) return null;
    return {
    id: i.id != null ? String(i.id) : null,
    userId: i.user_id != null ? String(i.user_id) : null,
    questionSetId: i.question_set_id != null ? String(i.question_set_id) : null,
    category: i.questionSet?.category ?? null,
    day: i.day ? i.day.toISOString() : null,
    interviewedAt: i.interviewed_at ? i.interviewed_at.toISOString() : null,
    createdAt: i.created_at ? i.created_at.toISOString() : null,
    updatedAt: i.updated_at ? i.updated_at.toISOString() : null,
    answers: Array.isArray(i.answers) ? i.answers.map(toInterviewAnswerDto) : [],
  }; 
}