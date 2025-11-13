import * as repo from "../repositories/questionSet.repository.js";

export async function listQuestionSets(userId) {
  return repo.findQuestionSets(userId);
}   

export async function listQuestions(setId) {
  return repo.findQuestionsBySet(setId);
}

export async function createQuestionSet({ userId, name, category }) {
  return repo.createQuestionSet({ userId, name, category });
}

export async function createQuestion(setId, { content, order = null, createdBy = null}) {
  return repo.createQuestion(setId, { content, order, createdBy });
}

export async function updateQuestionSet(setId, params) {
  return repo.updateQuestionSet(setId, params);
}

export async function updateQuestion(setId, questionId, params) {
  return repo.updateQuestion(setId, questionId, params);
}

export async function deleteQuestionSet(setId) {
  return repo.deleteQuestionSet(setId);
}

export async function deleteQuestion(setId, questionId) {
  return repo.deleteQuestion(setId, questionId);
}