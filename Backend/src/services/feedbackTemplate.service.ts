import * as repo from "../repositories/feedbackTemplate.repository.js";

/**
 * 사용자의 템플릿 목록 조회
 * @param {string|number} userId
 */
export async function getFeedbackTemplates({ userId }: { userId: string | number }) {
    return repo.findFeedbackTemplatesByUser({ userId });
}

/**
 * 사용자의 특정 카테고리 템플릿 조회
 * @param {string|number} userId
 * @param {string} category
 */
export async function getFeedbackTemplatesByCategory({ userId, category }: { userId: string | number; category: string }) {
    return await repo.findFeedbackTemplatesByUserAndCategory({ userId, category });
}

/**
 * @param {string|number} templateId 
 * @param {string|number} userId 
 * @param {Object} data 
 * @returns 
 */
export async function updateTemplate({ userId, category, content }: { userId: string | number; category: string; content: string }) {
    return repo.updateFeedbackTemplate({ userId, category, content });
}