import * as repo from "../repositories/feedbackTemplate.repository.js";

/**
 * 사용자의 템플릿 목록 조회 (선택적으로 카테고리 필터)
 * @param {string|number} userId
 * @param {string|undefined} category
 */
export async function getFeedbackTemplates({ userId }) {
    return repo.findFeedbackTemplatesByUser({ userId });
}

/**
 * @param {string|number} templateId 
 * @param {string|number} userId 
 * @param {Object} data 
 * @returns 
 */
export async function updateTemplate({ userId, category, content }) {
    return repo.updateFeedbackTemplate(userId, category, content);
}