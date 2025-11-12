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
    // BigInt() will throw on invalid numeric string
    return BigInt(s);
  }
  throw new Error("invalid id type");
}


/**
 * 특정 사용자에 대한 질문 세트 목록 조회
 * @param {string|number|bigint} userId
 * @returns {Promise<{items: Array, total: number}>}
 */
export async function findQuestionSets(userId) {

  const [items, total] = await Promise.all([
    prisma.questionSet.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc"},
      select: {
        id: true,
        user_id: true,
        name: true,
        category: true,
        created_at: true,
        updated_at: true,
        _count: { select: { questions: true } },
      },
    }),
    prisma.questionSet.count({ where: { user_id: userId } }),
  ]);

  return { items, total };
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
      select: {
        id: true,
        question_set_id: true,
        content: true,
        order: true,
        created_at: true,
        updated_at: true,
      },
    }),
    prisma.question.count({ where: { question_set_id: setIdBig } }),
  ]);

  return { items, total };
}

/**
 * 질문 세트 생성
 * @param {{userId: string|number|bigint, name: string, category: string}} params
 * @returns {Promise<Object>} created questionSet (select 포함)
 */
export async function createQuestionSet({ userId, name, category }) {
  const userIdBig = toBigInt(userId);

  const now = new Date();
  const created = await prisma.questionSet.create({
    data: {
      user_id: userIdBig,
      name,
      category,
      created_at: now,
      updated_at: now,
    },
    select: {
      id: true,
      user_id: true,
      name: true,
      category: true,
      created_at: true,
      updated_at: true,
      _count: { select: { questions: true } },
    },
  });

  return created;
}

/**
 * 질문 생성 (세트 존재 확인 포함)
 * @param {string|number|bigint} setId
 * @param {{content: string, order?: number|null}} params
 * @returns {Promise<Object>} created question
 */
export async function createQuestion(setId, { content, order = null }) {
  const setIdBig = toBigInt(setId);

  // 세트 존재 확인
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
    select: {
      id: true,
      question_set_id: true,
      content: true,
      order: true,
      created_at: true,
      updated_at: true,
    },
  });

  return created;
}