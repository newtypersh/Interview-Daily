import { prisma } from "../db.config.js";

function toBigInt(v) {
    if (typeof v === "bigint") return v;
    if (typeof v === "number") return BigInt(v);
    if (typeof v === "string") return BigInt(v);
    throw new Error("invalid id");
}

/**
 * 사용자의 피드백 템플릿 조회
 * @param {number | string | bigint} userId
 */
export async function findFeedbackTemplatesByUser(userId) {
    const userIdBig = toBigInt(userId);
    const rows = await prisma.feedbackTemplate.findMany({
        where: { user_id: userIdBig },
        orderBy: { created_at: "desc" },
    });
    return rows;
}