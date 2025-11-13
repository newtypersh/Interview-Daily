import * as repo from "../repositories/feedbackTemplate.repository.js";

export async function listTemplates(userId) {
    return repo.findFeedbackTemplatesByUser(userId);
}