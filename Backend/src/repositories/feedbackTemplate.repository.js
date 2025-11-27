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
 * 사용자의 피드백 템플릿 조회
 * @param {number | string | bigint} userId
 */
export async function findFeedbackTemplatesByUser({ userId }) {
    return await prisma.feedbackTemplate.findMany({
        where: { user_id: toBigInt(userId) },
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
 * 사용자의 특정 카테고리 템플릿 조회
 * @param {string|number} userId
 * @param {string} category
 */
export async function findFeedbackTemplatesByUserAndCategory({ userId, category }) {
    return await prisma.feedbackTemplate.findMany({
        where: { 
            user_id: toBigInt(userId),
            category: category,
        },
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
export async function updateFeedbackTemplate({ userId, category, content }) {
    const userIdBig = toBigInt(userId);

    return await prisma.feedbackTemplate.update({
        where: { 
            user_id_category: {
                user_id: userIdBig,
                category: category,
            
            },
        },
        data: {
            content: content,
            updated_at: new Date(),
        },
        select: { 
            id: true, 
            user_id: true,
            category: true,
            content: true,
            created_at: true,
            updated_at: true,
        },
    });
}