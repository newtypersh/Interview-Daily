import * as repo from "../repositories/feedbackTemplate.repository.js";

export async function listTemplates(userId) {
    return repo.findFeedbackTemplatesByUser(userId);
}

/**
 * 
 * @param {string|number} templateId 
 * @param {string|number} userId 
 * @param {Object} data 
 * @returns 
 */
export async function updateTemplate(templateId, userId, data) {
    return repo.updateFeedbackTemplate(templateId, userId, data);
}