import { prisma } from "../db.config.js";

function toBigInt(v) {
    if (typeof v === "bigint") return v;
    if (typeof v === "number") return BigInt(v);
    if (typeof v === "string") {
        const s = v.trim();
        if (s === "") throw Object.assign(new Error("invalid id"), { statusCode: 400 });
        return BigInt(s);
    }
    throw Object.assign(new Error("invalid id"), { statusCode: 400 });
}

export async function createFeedbacksForInterview(interviewId, userId, feedbacks) {
    const iId = toBigInt(interviewId);
    const uId = toBigInt(userId);

    const interview = await prisma.interview.findUnique({ where: { id: iId }, select: { user_id: true } });
    if (!interview) { const e = new Error("Interview not found"); e.statusCode = 404; throw e; }
    if (interview.user_id !== uId) { const e = new Error("Forbidden"); e.statusCode = 403; throw e; }

    return prisma.$transaction(async (tx) => {
        const results = [];
        for (const f of feedbacks) {
            const answerId = toBigInt(f.intervieweAnswerId);

            const up = await tx.feedback.upsert({
                where: { interview_answer_id: answerId },
                update: {
                    rating: f.rating != null ? Number(f.rating) : undefined,
                    feedback_text: f.feedbackText ?? undefined,
                    updated_at: new Date(),
                },
                create: {
                    interview_answer_id: answerId,
                    question_id: f.questionId ? toBigInt(f.questionId) : undefined,
                    rating: f.rating != null ? Number(f.rating) : undefined,
                    feedback_text: f.feedbackText ?? undefined,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            })
            results.push(up);
        }
        return results;
    })
}