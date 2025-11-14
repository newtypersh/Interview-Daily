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
                orderBy: { sequence: "asc" },
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