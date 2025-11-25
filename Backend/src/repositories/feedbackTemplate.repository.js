import { prisma } from "../db.config.js";

function toBigInt(v) {
    if (typeof v === "bigint") return v;
    if (typeof v === "number") return BigInt(v);
    if (typeof v === "string") {
        const s = v.trim();
        if (s === "") throw new Error("invalid id");
        return BigInt(s);
    }
    throw new Error("invalid id");
}

/**
 * 사용자의 피드백 템플릿 조회 (category optional)
 * @param {number | string | bigint} userId
 * @param {string|undefined} category
 */
export async function findFeedbackTemplatesByUser({ userId, category }) {
    const userIdBig = toBigInt(userId);

    const where = { user_id: userIdBig };
    
    if (category !== undefined && category !== null) {
        where.category = category;
    }
    
    return await prisma.feedbackTemplate.findMany({
        where,
        orderBy: { created_at: "desc" },
        select: {
            id: true,
            user_id: true,
            category: true,
            content: true,
            created_at: true,
            updated_at: true,
        }
    });
}

/**
 * 템플릿 업데이트 (소유자 검증 포함)
 * @param {string|number} templateId
 * @param {string|number} userId
 * @param {Object} data
 */
export async function updateFeedbackTemplate(templateId, userId, data) {
    const tId = toBigInt(templateId);
    const uId = toBigInt(userId);

    const existing = await prisma.feedbackTemplate.findUnique({
        where: { id: tId },
        select: { id: true, user_id: true },
    });

    if (!existing) {
        const err = new Error("Feedback template not found");
        err.statusCode = 404;
        throw err;
    }
    if (existing.user_id !== uId) {
        const err = new Error("Forbidden");
        err.statusCode = 403;
        throw err;
    }

    const updateData = {  ...data, updated_at: new Date() };

    const updated = await prisma.feedbackTemplate.update({
        where: { id: tId },
        data: updateData,
    });

    return updated;
}