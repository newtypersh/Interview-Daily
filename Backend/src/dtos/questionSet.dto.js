import { BadRequestError, UnauthorizedError } from "../errors.js";

export function toListQuestionsRequest(req) {
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setId = Number(req.params.setId);
  if (Number.isNaN(setId)) {
    throw new BadRequestError("setId는 숫자여야 합니다.", { setId: req.params.setId });
  }

  return { userId, setId };
}

export function toListItem(row) {
  return {
    id: row.id != null ? String(row.id) : null,
    userId: row.user_id != null ? String(row.user_id) : null,
    name: row.name ?? null,
    category: row.category ?? null,
    questionCount: row._count?.questions ?? 0,
    created_at: row.created_at ? row.created_at.toISOString() : null,
    updated_at: row.updated_at ? row.updated_at.toISOString() : null,
  };
}

export function toQuestionItem(row) {
  return {
    id: row.id != null ? String(row.id) : null,
    questionSetId: row.question_set_id != null ? String(row.question_set_id) : null,
    content: row.content ?? null,
    order: row.order ?? null,
    created_at: row.created_at ? row.created_at.toISOString() : null,
    updated_at: row.updated_at ? row.updated_at.toISOString() : null,
  };
}
