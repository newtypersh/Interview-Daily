import * as repo from "../repositories/feedback.repository.js";

/**
 * 배치 피드백 생성/업데이트
 * @param {string|number} interviewId
 * @param {string|number} userId
 * @param {Array} feedbacks
 */

export async function createFeedbacksForInterview(interviewId, userId, feedbacks) {
    return repo.createFeedbacksForInterview(interviewId, userId, feedbacks);
}