import { Request } from "express";
import { QuestionSet, Question } from "@prisma/client";
import { BadRequestError, UnauthorizedError } from "../errors.js";

type QuestionSetWithCount = QuestionSet & {
  _count?: {
    questions: number;
  } | null;
};

export function toListQuestionsRequest(req: Request) {
  const userId = (req.user as any)?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setId = Number(req.params.setId);
  if (Number.isNaN(setId)) {
    throw new BadRequestError("setId는 숫자여야 합니다.", { setId: req.params.setId });
  }

  return { userId, setId };
}

export function toListQuestionSetsRequest(req: Request) {
  const userId = (req.user as any)?.id;
  
  if (!userId) {
    throw new UnauthorizedError("로그인이 필요합니다.", { path: req.path });
  }

  return { userId };
}

// POST /api/question-sets
export function toCreateQuestionSetRequest(req: Request) {
  const userId = (req.user as any)?.id;
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
export function toCreateQuestionRequest(req: Request) {
  const userId = (req.user as any)?.id;
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
export function toUpdateQuestionSetRequest(req: Request) {
  const userId = (req.user as any)?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setId = Number(req.params.setId);
  if (Number.isNaN(setId)) {
    throw new BadRequestError("setId는 숫자여야 합니다.", { setId: req.params.setId });
  }

  const { name, category } = req.body ?? {};
  const data: any = {};

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

// PATCH /api/question-sets/:setId/questions/:questionId
export function toUpdateQuestionRequest(req: Request) {
  const userId = (req.user as any)?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setId = Number(req.params.setId);
  const questionId = Number(req.params.questionId);

  if (Number.isNaN(setId) || Number.isNaN(questionId)) {
    throw new BadRequestError("setId와 questionId는 숫자여야 합니다", {
      setId: req.params.setId,
      questionId: req.params.questionId,
    });
  }
  
  const { content, order } = req.body ?? {};
  const data: any = {};

  if (content != null) {
    const c = String(content).trim();
    if (c.length === 0) {
      throw new BadRequestError("content가 비어있습니다.");
    }
    data.content = c;
  }

  if (order != null) {
    const o = Number(order);
    if (Number.isNaN(o)) {
      throw new BadRequestError("order는 숫자여야 합니다.", { order });
    }
    data.order = o;
  }

  if (Object.keys(data).length === 0) {
    throw new BadRequestError("수정할 필드를 하나 이상 제공하세요.");
  }

  return { userId, setId, questionId, data };
}

export function toDeleteQuestionSetRequest(req: Request) {
  const userId = (req.user as any)?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setId = Number(req.params.setId);
  if (Number.isNaN(setId)) {
    throw new BadRequestError("setId는 숫자여야 합니다.", { setId: req.params.setId });
  }

  return { userId, setId };
}

export function toDeleteQuestionRequest(req: Request) {
  const userId = (req.user as any)?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setId = Number(req.params.setId);
  const questionId = Number(req.params.questionId);

  if (Number.isNaN(setId) || Number.isNaN(questionId)) {
    throw new BadRequestError("setId와 questionId는 숫자여야 합니다", {
      setId: req.params.setId,
      questionId: req.params.questionId,
    });
  }

  return { userId, setId, questionId };
}

export function toListItem(row: QuestionSetWithCount | null) {
  if (!row) return null;
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

export function toQuestionItem(row: Question | null) {
  if (!row) return null;
  return {
    id: row.id != null ? String(row.id) : null,
    questionSetId: row.question_set_id != null ? String(row.question_set_id) : null,
    content: row.content ?? null,
    order: row.order ?? null,
    created_at: row.created_at ? row.created_at.toISOString() : null,
    updated_at: row.updated_at ? row.updated_at.toISOString() : null,
  };
}
