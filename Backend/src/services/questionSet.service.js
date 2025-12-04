import * as repo from "../repositories/questionSet.repository.js";

export async function listQuestionSets(userId) {
  return repo.findQuestionSets(userId);
}   

export async function listQuestions({userId, setId}) {
  return repo.findQuestionsBySet({userId, setId});
}

export async function createQuestionSet({ userId, name, category }) {
  return repo.createQuestionSet({ userId, name, category });
}

export async function createQuestion({ setId, content, order = null }) {
  return repo.createQuestion(setId, { content, order });
}

export async function updateQuestionSet({ setId, userId, data }) {
  return repo.updateQuestionSet(setId, { userId, ...data });
}

export async function updateQuestion({ setId, questionId, userId, data }) {
  return repo.updateQuestion(setId, questionId, { userId, ...data });
}

export async function deleteQuestionSet({ setId, userId }) {
  return repo.deleteQuestionSet(setId, userId);
}

export async function deleteQuestion({ setId, questionId, userId }) {
  return repo.deleteQuestion(setId, questionId, { userId });
}