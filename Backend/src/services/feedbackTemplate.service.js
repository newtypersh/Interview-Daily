import * as repo from "../repositories/feedbackTemplate.repository.js";

/**
 * 사용자의 템플릿 목록 조회 (선택적으로 카테고리 필터)
 * @param {string|number} userId
 * @param {string|undefined} category
 */
export async function listTemplates(userId, category = undefined) {
    return repo.findFeedbackTemplatesByUser(userId, category);
}

/**
 * @param {string|number} templateId 
 * @param {string|number} userId 
 * @param {Object} data 
 * @returns 
 */
export async function updateTemplate(templateId, userId, data) {
    return repo.updateFeedbackTemplate(templateId, userId, data);
}