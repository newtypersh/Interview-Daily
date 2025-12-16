import { prisma } from "../db.config.js";
import { Prisma, PrismaClient } from "@prisma/client";

type PrismaTx = Prisma.TransactionClient | PrismaClient;

function toBigInt(v: string | number | bigint): bigint {
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
export async function findFeedbackTemplatesByUser({ userId }: { userId: string | number | bigint }) {
    return await prisma.feedbackTemplate.findMany({
        where: { user_id: toBigInt(userId) },
        orderBy: { created_at: "desc" },
        select: {
            id: true,
            user_id: true,
            category: true,
            template_text: true,
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
export async function findFeedbackTemplatesByUserAndCategory({ userId, category }: { userId: string | number | bigint; category: string }) {
    // category casting might be needed if using enum in schema
    return await prisma.feedbackTemplate.findMany({
        where: { 
            user_id: toBigInt(userId),
            category: category as any,
        },
        select: {
            id: true,
            user_id: true,
            category: true,
            template_text: true,
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
export async function updateFeedbackTemplate({ userId, category, content }: { userId: string | number | bigint; category: string; content: string }) {
    const userIdBig = toBigInt(userId);

    // 1. 해당 카테고리의 템플릿 찾기
    const template = await prisma.feedbackTemplate.findFirst({
        where: {
            user_id: userIdBig,
            category: category as any,
        },
    });

    if (!template) {
        throw new Error("Feedback template not found");
    }

    // 2. ID로 업데이트
    return await prisma.feedbackTemplate.update({
        where: { id: template.id },
        data: {
            template_text: content,
            updated_at: new Date(),
        },
        select: { 
            id: true, 
            user_id: true,
            category: true,
            template_text: true,
            created_at: true,
            updated_at: true,
        },
    });
}