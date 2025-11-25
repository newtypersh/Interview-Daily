import { BadRequestError } from "../errors.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";

export function toListQuestionSetsRequest(req) {
  const userId = req.user?.id;
  
  if (!userId) {
    throw new UnauthorizedError("로그인이 필요합니다.", { path: req.path });
  }

  return { userId };
}

// POST /api/question-sets
export function toCreateQuestionSetRequest(req) {
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const { name, category } = req.body ?? {};

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("name(1~20자)이 필요합니다.");
  }

  const trimmedName = name.trim();
  if (trimmedName.length > 20) {
    throw new BadRequestError("name은 최대 20자입니다.")
  }

  const allowedCategories = ["JOB", "PERSONAL", "MOTIVATION"];
  if (!category || !allowedCategories.includes(category)) {
    throw new BadRequestError(
      `category는 ${allowedCategories.join(", ")} 중 하나여야 합니다.`,
      { category, allowed: allowedCategories}
    );
  }

  return { userId, name: trimmedName,  category };
}

// POST /api/question-sets/:setId/questions
export function toCreateQuestionRequest(req) {
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setId = Number(req.params.setId);
  if (Number.isNaN(setId)) {
    throw new BadRequestError("setId는 숫자여야 합니다.", { setId: req.params.setId });
  }

  const content = req.body?.content;
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new BadRequestError("content가 필요합니다.");
  }

  const orderRaw = req.body?.order;
  const order = orderRaw == null ? null : Number(orderRaw);
  if (orderRaw != null && Number.isNaN(order)) {
    throw new BadRequestError("order는 숫자여야 합니다.");
  }

  return { userId, setId, content: content.trim(), order };
}

// PATCH /api/question-sets/:setId
export function toUpdateQuestionSetRequest(req) {
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setId = Number(req.params.setId);
  if (Number.isNaN(setId)) {
    throw new BadRequestError("setId는 숫자여야 합니다.", { setId: req.params.setId });
  }

  const { name, category } = req.body ?? {};
  const data = {};

  if (name != null) {
    const t = String(name).trim();
    if (t.length === 0 || t.length > 20) {
      throw new BadRequestError("name은 1~20자 사이여야 합니다.", { name });
    }
    data.name = t;
  }

  if (category != null) {
    const allowed = ["JOB", "PERSONAL", "MOTIVATION"];
    if (!allowed.includes(category)) {
      throw new BadRequestError(
        `category는 ${allowed.join(", ")} 중 하나여야 합니다.`,
        { category, allowed }
      );
    }
    data.category = category;
  }

  if (Object.keys(data).length === 0) {
    throw new BadRequestError("수정할 필드를 하나 이상 제공하세요.");
  }

  return { userId, setId, data };
}

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
    };
}

export function toInterviewDto(i) {
    if (!i) return null;
    return {
    id: i.id != null ? String(i.id) : null,
    userId: i.user_id != null ? String(i.user_id) : null,
    questionSetId: i.question_set_id != null ? String(i.question_set_id) : null,
    day: i.day ? i.day.toISOString() : null,
    interviewedAt: i.interviewed_at ? i.interviewed_at.toISOString() : null,
    createdAt: i.created_at ? i.created_at.toISOString() : null,
    updatedAt: i.updated_at ? i.updated_at.toISOString() : null,
    answers: Array.isArray(i.answers) ? i.answers.map(toInterviewAnswerDto) : [],
  }; 
}