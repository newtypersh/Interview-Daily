import * as repo from "../repositories/questionSet.repository.js";

export async function listQuestionSets(userId) {
  return repo.findQuestionSets(userId);
}   

export async function listQuestions(setId) {
  return repo.findQuestionsBySet(setId);
}