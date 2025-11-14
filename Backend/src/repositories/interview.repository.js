import { prisma } from "../db.config.js";

function toBigInt(v) {
    if (typeof v === "bigint") return v;
    if (typeof v === "number") return BigInt(v);
    if (typeof v === "string") return BigInt(v);
    throw new Error("invalid id");
}

export async function findInterviewByUserAndDay(userId, day) {
    const u = toBigInt(userId);
    return prisma.interview.findFirst({
        where: { user_id: u, day },
        include: { answers: { orderBy: { sequence: "asc" } } },
    });
}

export async function pickQuestionSetForUser(userId, { strategy }) {
    const u = toBigInt(userId);

    const sets = await prisma.questionSet.findMany({ where: { user_id: u } });
    if (!sets || sets.length === 0) throw Object.assign(new Error("no question sets"), { statusCode: 400 });
    return sets[Math.floor(Math.random() * sets.length)];
}

export async function createInterview({ userId, questionSetId, day, createQuestionsFromSet = false }) {
    const u = toBigInt(userId);
    const q = toBigInt(questionSetId);

    return prisma.$transaction(async (tx) => {
        const createdInterview = await tx.interview.create({
            data: { user_id: u, question_set_id: q, day, created_at: new Date(), updated_at: new Date() },
        });

        if (createQuestionsFromSet) {
            const questions = await tx.question.findMany({
                where: { question_set_id: q },
                orderBy: { order: "asc" },
            });

            for (let i = 0; i < questions.length; i++) {
                const qrow = questions[i];
                await tx.interviewAnswer.create({
                    data: {
                        interview_id: createdInterview.id,
                        question_id: qrow.id,
                        sequence: i + 1,
                        audio_url: null,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }
        }

        return tx.interview.findUnique({
            where: { id: createdInterview.id },
            include: { answers: { orderBy: { sequence: "asc" } } },
        });
    });
}

export async function upsertInterviewAnswer({ interviewId, userId, interviewAnswerId, questionId, sequence, audio_url }) {
    const iId = toBigInt(interviewId);
    const uId = toBigInt(userId);

    const iv = await prisma.interview.findUnique({ where: { id: iId }, select: { user_id: true, question_set_id: true } });
    if (!iv) { const e = new Error("interview not found"); e.statusCode = 404; throw e; }
    if (iv.user_id !== uId) { const e = new Error("forbidden"); e.statusCode = 403; throw e; }

    if (interviewAnswerId) {
        const aId = toBigInt(interviewAnswerId);
        const existing = await prisma.interviewAnswer.findUnique({ where: { id: aId }, select: { interview_id: true } });
        if (!existing || existing.interview_id !== iId) { const e = new Error("answer not found or mismatch"); e.statusCode = 404; throw e; }

        const updated = await prisma.interviewAnswer.update({
            where: { id: aId },
            data: {
                sequence: sequence ?? undefined,
                audio_url: audio_url ?? undefined,
                updated_at: new Date(),
            },
        });
        return updated;
    } else {
        const qId = toBigInt(questionId);
        const created = await prisma.interviewAnswer.create({
            data: {
                interview_id: iId,
                question_id: qId,
                sequence: sequence ?? 1,
                audio_url: audio_url ?? null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        return created;
    }
}