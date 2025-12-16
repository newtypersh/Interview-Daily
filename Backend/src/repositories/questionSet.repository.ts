import { prisma } from "../db.config.js";
import { NotFoundError, ForbiddenError } from "../errors.js";
import { Prisma, PrismaClient, QuestionSet } from "@prisma/client";

type PrismaTx = Prisma.TransactionClient | PrismaClient;

function toBigInt(val: string | number | bigint): bigint {
  if (typeof val === "bigint") return val;
  if (typeof val === "number") {
    if (!Number.isFinite(val)) throw new Error("invalid id");
    return BigInt(Math.trunc(val));
  }
  if (typeof val === "string") {
    const s = val.trim();
    if (s === "") throw new Error("invalid id");
    return BigInt(s);
  }
  throw new Error("invalid id type");
}

const QUESTION_SET_SELECT = {
  id: true,
  user_id: true,
  name: true,
  category: true,
  created_at: true,
  updated_at: true,
};

const QUESTION_SELECT = {
  id: true,
  question_set_id: true,
  content: true,
  order: true,
  created_at: true,
  updated_at: true,
};

export async function findQuestionSets(userId: string | number | bigint) {
  const userIdBig = toBigInt(userId);
  
  return prisma.questionSet.findMany({
    where: { user_id: userIdBig },
    orderBy: { created_at: "desc" },
    select: QUESTION_SET_SELECT,
  });
}

export async function findQuestionSetById(setId: string | number | bigint) {
  const setIdBig = toBigInt(setId);
  return prisma.questionSet.findUnique({
    where: { id: setIdBig },
    select: QUESTION_SET_SELECT,
  });
}

export async function findQuestionsBySet({userId, setId}: {userId: string | number | bigint; setId: string | number | bigint}) {
  const setIdBig = toBigInt(setId);
  const userIdBig = toBigInt(userId);

  // 1. 세트 존재 & 소유권 확인
  const set = await prisma.questionSet.findUnique({
    where: { id: setIdBig },
    select: { id: true, user_id: true },
  });

  if (!set) {
    throw new NotFoundError("질문 세트를 찾을 수 없습니다.", { setId });
  }

  if (set.user_id !== userIdBig) {
    throw new ForbiddenError("해당 질문 세트에 접근할 권한이 없습니다.", { setId, userId });
  }

  // 2. 권한 확인 후 질문 조회
  return prisma.question.findMany({
    where: { question_set_id: setIdBig },
    orderBy: { order: "asc" },
    select: QUESTION_SELECT,
  });
}

export async function createQuestionSet({ userId, name, category }: { userId: string | number | bigint; name: string; category: any }) { 
    // category type: QuestionCategory enum ideally, but string allowed for now with casting or known valid strings
  const userIdBig = toBigInt(userId);
  const now = new Date();

  try {
    const created = await prisma.questionSet.create({
      data: {
        user_id: userIdBig,
        name,
        category: category, // Assuming valid enum string
        created_at: now,
        updated_at: now,
      },
      select: QUESTION_SET_SELECT,
    });
    return created;
  } catch (err) {
    throw err;
  }
}

export async function updateQuestionSet(setId: string | number | bigint, { userId, name, category }: { userId: string | number | bigint; name?: string; category?: any }) {
  const setIdBig = toBigInt(setId);
  const userIdBig = toBigInt(userId);

  // 소유자 확인
  const existing = await prisma.questionSet.findUnique({
    where: { id: setIdBig },
    select: { id: true, user_id: true },
  });
  if (!existing) {
    const err = new Error("Question set not found");
    (err as any).statusCode = 404;
    throw err;
  }
  if (existing.user_id !== userIdBig) {
    const err = new Error("Forbidden");
    (err as any).statusCode = 403;
    throw err;
  }

  const data: Prisma.QuestionSetUpdateInput = {};
  if (name !== undefined) data.name = name;
  if (category !== undefined) data.category = category;
  data.updated_at = new Date();

  const updated = await prisma.questionSet.update({
    where: { id: setIdBig },
    data,
    select: QUESTION_SET_SELECT,
  });

  return updated;
}

export async function deleteQuestionSet(setId: string | number | bigint, userId: string | number | bigint) {
  const setIdBig = toBigInt(setId);
  const userIdBig = toBigInt(userId);

  const existing = await prisma.questionSet.findUnique({
    where: { id: setIdBig },
    select: { id: true, user_id: true },
  });
  if (!existing) {
    const err = new Error("Question set not found");
    (err as any).statusCode = 404;
    throw err;
  }
  if (existing.user_id !== userIdBig) {
    const err = new Error("Forbidden");
    (err as any).statusCode = 403;
    throw err;
  }

  const interviews = await prisma.interview.findMany({
    where: { question_set_id: setIdBig },
    select: { id: true }
  });
  const interviewIds = interviews.map(i => i.id);

  const answers = await prisma.interviewAnswer.findMany({
    where: { interview_id: { in: interviewIds } },
    select: { id: true }
  });
  const answerIds = answers.map(a => a.id);

  await prisma.$transaction([
    prisma.feedback.deleteMany({ where: { interview_answer_id: { in: answerIds } } }),
    prisma.interviewAnswer.deleteMany({ where: { interview_id: { in: interviewIds } } }),
    prisma.interview.deleteMany({ where: { id: { in: interviewIds } } }),
    prisma.question.deleteMany({ where: { question_set_id: setIdBig } }),
    prisma.questionSet.delete({ where: { id: setIdBig } }),
  ]);

  return true;
}

export async function findQuestionById(questionId: string | number | bigint) {
  const qId = toBigInt(questionId);
  return prisma.question.findUnique({ where: { id: qId }, select: QUESTION_SELECT });
}

export async function createQuestion(setId: string | number | bigint, { content, order = null }: { content: string; order?: number | null }) {
  const setIdBig = toBigInt(setId);

  const set = await prisma.questionSet.findUnique({ where: { id: setIdBig }, select: { id: true } });
  if (!set) {
    const err = new Error("Question set not found");
    (err as any).statusCode = 404;
    throw err;
  }

  const now = new Date();
  const created = await prisma.question.create({
    data: {
      question_set_id: setIdBig,
      content,
      order: order != null ? Number(order) : null,
      created_at: now,
      updated_at: now,
    },
    select: QUESTION_SELECT,
  });

  return created;
}

export async function updateQuestion(setId: string | number | bigint, questionId: string | number | bigint, { userId, content, order }: { userId?: string | number | bigint; content?: string; order?: number }) {
  const setIdBig = toBigInt(setId);
  const questionIdBig = toBigInt(questionId);

  const existing = await prisma.question.findUnique({
    where: { id: questionIdBig },
    select: { id: true, question_set_id: true },
  });
  if (!existing || existing.question_set_id !== setIdBig) {
    const err = new Error("Question not found in the set");
    (err as any).statusCode = 404;
    throw err;
  }

  if (userId !== undefined) {
    const userIdBig = toBigInt(userId);
    const set = await prisma.questionSet.findUnique({ where: { id: setIdBig }, select: { user_id: true } });
    if (!set) {
      const err = new Error("Question set not found");
      (err as any).statusCode = 404;
      throw err;
    }
    if (set.user_id !== userIdBig) {
      const err = new Error("Forbidden");
      (err as any).statusCode = 403;
      throw err;
    }
  }

  const data: Prisma.QuestionUpdateInput = {};
  if (content !== undefined) data.content = content;
  if (order !== undefined) data.order = order;
  data.updated_at = new Date();

  const updated = await prisma.question.update({
    where: { id: questionIdBig },
    data,
    select: QUESTION_SELECT,
  });

  return updated;
}

export async function deleteQuestion(setId: string | number | bigint, questionId: string | number | bigint, { userId }: { userId?: string | number | bigint } = {}) {
  const setIdBig = toBigInt(setId);
  const questionIdBig = toBigInt(questionId);

  const existing = await prisma.question.findUnique({
    where: { id: questionIdBig },
    select: { id: true, question_set_id: true },
  });
  if (!existing || existing.question_set_id !== setIdBig) {
    const err = new Error("Question not found in the set");
    (err as any).statusCode = 404;
    throw err;
  }

  if (userId !== undefined) {
    const userIdBig = toBigInt(userId);
    const set = await prisma.questionSet.findUnique({ where: { id: setIdBig }, select: { user_id: true } });
    if (!set) {
      const err = new Error("Question set not found");
      (err as any).statusCode = 404;
      throw err;
    }
    if (set.user_id !== userIdBig) {
      const err = new Error("Forbidden");
      (err as any).statusCode = 403;
      throw err;
    }
  }

  await prisma.question.delete({ where: { id: questionIdBig } });
  return true;
}