import * as repo from "../repositories/interview.repository.js";

// getInterviewHistory: cursor 기반 페이지 조회
export async function getInterviewHistory({ userId, limit = 20, cursorCreatedAt = null, cursorId = null }: { userId: string | number | bigint; limit?: number; cursorCreatedAt?: string | null; cursorId?: string | null }) {
    return repo.findInterviewsByUserPaginated(userId, { limit, cursorCreatedAt, cursorId });
}