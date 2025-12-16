import * as repo from "../repositories/questionSet.repository.js";

export async function listQuestionSets(userId: string | number) {
  return repo.findQuestionSets(userId);
}   

export async function listQuestions({userId, setId}: {userId: string | number; setId: string | number}) {
  return repo.findQuestionsBySet({userId, setId});
}

export async function createQuestionSet({ userId, name, category }: { userId: string | number; name: string; category: string }) {
  return repo.createQuestionSet({ userId, name, category });
}

export async function createQuestion({ setId, content, order = null }: { setId: string | number; content: string; order?: number | null }) {
  return repo.createQuestion(setId, { content, order });
}

export async function updateQuestionSet({ setId, userId, data }: { setId: string | number; userId: string | number; data: any }) {
  return repo.updateQuestionSet(setId, { userId, ...data });
}

export async function updateQuestion({ setId, questionId, userId, data }: { setId: string | number; questionId: string | number; userId: string | number; data: any }) {
  return repo.updateQuestion(setId, questionId, { userId, ...data });
}

export async function deleteQuestionSet({ setId, userId }: { setId: string | number; userId: string | number }) {
  return repo.deleteQuestionSet(setId, userId);
}

export async function deleteQuestion({ setId, questionId, userId }: { setId: string | number; questionId: string | number; userId: string | number }) {
  return repo.deleteQuestion(setId, questionId, { userId });
}