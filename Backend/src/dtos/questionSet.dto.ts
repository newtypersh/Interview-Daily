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
// POST /api/question-sets
export function toCreateQuestionSetRequest(req: Request) {
  const userId = (req.user as any)?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const { name, category } = req.body;
  return { userId, name, category };
}


// POST /api/question-sets/:setId/questions
export function toCreateQuestionRequest(req: Request) {
  const userId = (req.user as any)?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setId = Number(req.params.setId);
  const { content, order } = req.body;

  // order is optional in body, if present it is number (validated by Zod)
  return { userId, setId, content, order: order ?? null };
}


// PATCH /api/question-sets/:setId
export function toUpdateQuestionSetRequest(req: Request) {
  const userId = (req.user as any)?.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const setId = Number(req.params.setId);
  const { name, category } = req.body;
  const data: any = {};

  if (name !== undefined) data.name = name;
  if (category !== undefined) data.category = category;

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
  const { content, order } = req.body;
  const data: any = {};

  if (content !== undefined) data.content = content;
  if (order !== undefined) data.order = order;

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
