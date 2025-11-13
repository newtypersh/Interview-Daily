import { prisma } from "../db.config.js";

/**
 * 유효한 id(string|number|bigint)를 BigInt로 변환
 * @param {string|number|bigint} val
 * @returns {bigint}
 */
function toBigInt(val) {
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

/**
 * 공통 select projection (DTO 변환 전에 사용할 것)
 */
const QUESTION_SET_SELECT = {
  id: true,
  user_id: true,
  name: true,
  category: true,
  created_at: true,
  updated_at: true,
  _count: { select: { questions: true } },
};

const QUESTION_SELECT = {
  id: true,
  question_set_id: true,
  content: true,
  order: true,
  created_at: true,
  updated_at: true,
};

/**
 * 특정 사용자에 대한 질문 세트 목록 조회
 * @param {string|number|bigint} userId
 * @returns {Promise<{items: Array, total: number}>}
 */
export async function findQuestionSets(userId) {
  const userIdBig = toBigInt(userId);

  const [items, total] = await Promise.all([
    prisma.questionSet.findMany({
      where: { user_id: userIdBig },
      orderBy: { created_at: "desc" },
      select: QUESTION_SET_SELECT,
    }),
    prisma.questionSet.count({ where: { user_id: userIdBig } }),
  ]);

  return { items, total };
}

/**
 * 질문 세트 단건 조회
 * @param {string|number|bigint} setId
 * @returns {Promise<Object|null>}
 */
export async function findQuestionSetById(setId) {
  const setIdBig = toBigInt(setId);
  return prisma.questionSet.findUnique({
    where: { id: setIdBig },
    select: QUESTION_SET_SELECT,
  });
}

/**
 * 세트 내 질문 목록 조회
 * @param {string|number|bigint} setId
 * @returns {Promise<{items: Array, total: number}>}
 */
export async function findQuestionsBySet(setId) {
  const setIdBig = toBigInt(setId);

  const [items, total] = await Promise.all([
    prisma.question.findMany({
      where: { question_set_id: setIdBig },
      orderBy: { order: "asc" },
      select: QUESTION_SELECT,
    }),
    prisma.question.count({ where: { question_set_id: setIdBig } }),
  ]);

  return { items, total };
}

/**
 * 질문 세트 생성
 * @param {{userId: string|number|bigint, name: string, category: string}} params
 * @returns {Promise<Object>} created questionSet
 */
export async function createQuestionSet({ userId, name, category }) {
  const userIdBig = toBigInt(userId);
  const now = new Date();

  try {
    const created = await prisma.questionSet.create({
      data: {
        user_id: userIdBig,
        name,
        category,
        created_at: now,
        updated_at: now,
      },
      select: QUESTION_SET_SELECT,
    });
    return created;
  } catch (err) {
    // Prisma unique constraint 등 구체적 처리 원하면 여기서 처리
    throw err;
  }
}

/**
 * 질문 세트 업데이트 (소유자 검증 포함)
 * @param {string|number|bigint} setId
 * @param {{userId: string|number|bigint, name?: string, category?: string}} params
 * @returns {Promise<Object>} updated questionSet
 */
export async function updateQuestionSet(setId, { userId, name = undefined, category = undefined }) {
  const setIdBig = toBigInt(setId);
  const userIdBig = toBigInt(userId);

  // 소유자 확인
  const existing = await prisma.questionSet.findUnique({
    where: { id: setIdBig },
    select: { id: true, user_id: true },
  });
  if (!existing) {
    const err = new Error("Question set not found");
    err.statusCode = 404;
    throw err;
  }
  if (existing.user_id !== userIdBig) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  const data = {};
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

/**
 * 질문 세트 삭제 (소유자 검증 포함)
 * @param {string|number|bigint} setId
 * @param {string|number|bigint} userId
 */
export async function deleteQuestionSet(setId, userId) {
  const setIdBig = toBigInt(setId);
  const userIdBig = toBigInt(userId);

  const existing = await prisma.questionSet.findUnique({
    where: { id: setIdBig },
    select: { id: true, user_id: true },
  });
  if (!existing) {
    const err = new Error("Question set not found");
    err.statusCode = 404;
    throw err;
  }
  if (existing.user_id !== userIdBig) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  // cascade 삭제가 설정되어 있지 않다면 트랜잭션으로 질문들 먼저 삭제 후 세트 삭제
  await prisma.$transaction([
    prisma.question.deleteMany({ where: { question_set_id: setIdBig } }),
    prisma.questionSet.delete({ where: { id: setIdBig } }),
  ]);

  return true;
}

/**
 * 질문 단건 조회
 * @param {string|number|bigint} questionId
 */
export async function findQuestionById(questionId) {
  const qId = toBigInt(questionId);
  return prisma.question.findUnique({ where: { id: qId }, select: QUESTION_SELECT });
}

/**
 * 질문 생성 (set 존재 확인 포함)
 * @param {string|number|bigint} setId
 * @param {{content: string, order?: number|null}} params
 * @returns {Promise<Object>} created question
 */
export async function createQuestion(setId, { content, order = null }) {
  const setIdBig = toBigInt(setId);

  const set = await prisma.questionSet.findUnique({ where: { id: setIdBig }, select: { id: true } });
  if (!set) {
    const err = new Error("Question set not found");
    err.statusCode = 404;
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

/**
 * 질문 업데이트 (세트 소유자만 허용하는 경우 userId로 검증)
 * @param {string|number|bigint} setId
 * @param {string|number|bigint} questionId
 * @param {{userId?: string|number|bigint, content?: string, order?: number}} params
 */
export async function updateQuestion(setId, questionId, { userId = undefined, content = undefined, order = undefined }) {
  const setIdBig = toBigInt(setId);
  const questionIdBig = toBigInt(questionId);

  // 질문과 세트 일치 확인
  const existing = await prisma.question.findUnique({
    where: { id: questionIdBig },
    select: { id: true, question_set_id: true },
  });
  if (!existing || existing.question_set_id !== setIdBig) {
    const err = new Error("Question not found in the set");
    err.statusCode = 404;
    throw err;
  }

  // 소유자 검증(옵션): 세트의 user_id와 주어진 userId 비교
  if (userId !== undefined) {
    const userIdBig = toBigInt(userId);
    const set = await prisma.questionSet.findUnique({ where: { id: setIdBig }, select: { user_id: true } });
    if (!set) {
      const err = new Error("Question set not found");
      err.statusCode = 404;
      throw err;
    }
    if (set.user_id !== userIdBig) {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      throw err;
    }
  }

  const data = {};
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

/**
 * 질문 삭제 (세트 소유자 검증)
 */
export async function deleteQuestion(setId, questionId, { userId = undefined } = {}) {
  const setIdBig = toBigInt(setId);
  const questionIdBig = toBigInt(questionId);

  const existing = await prisma.question.findUnique({
    where: { id: questionIdBig },
    select: { id: true, question_set_id: true },
  });
  if (!existing || existing.question_set_id !== setIdBig) {
    const err = new Error("Question not found in the set");
    err.statusCode = 404;
    throw err;
  }

  if (userId !== undefined) {
    const userIdBig = toBigInt(userId);
    const set = await prisma.questionSet.findUnique({ where: { id: setIdBig }, select: { user_id: true } });
    if (!set) {
      const err = new Error("Question set not found");
      err.statusCode = 404;
      throw err;
    }
    if (set.user_id !== userIdBig) {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      throw err;
    }
  }

  await prisma.question.delete({ where: { id: questionIdBig } });
  return true;
}