import { prisma } from "../db.config.js";

export async function findQuestionSets(userId) {

  const items = await prisma.questionSet.findMany({
    where: { user_id: userId },
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

  const total = await prisma.questionSet.count({ where: { user_id: userId } });

  return { items, total };
}

export async function findQuestionsBySet(setId) {
  const items = await prisma.question.findMany({
    where: { question_set_id: Number(setId) },
    select: { id: true, question_set_id: true, content: true, order: true, created_at: true, updated_at: true },
  });

  const total = await prisma.question.count({ where: { question_set_id: Number(setId) } });

  return { items, total };
}
