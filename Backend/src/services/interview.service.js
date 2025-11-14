import * as repo from "../repositories/interview.repository.js";

export async function startInterview({ userId, strategy = "random" }) {
    if (!userId) throw Object.assign(new Error("unauthorized"), { statusCode: 401 });

    const now = new Date();
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const existing = await repo.findInterviewByUserAndDate(userId, day);
    if (existing) return existing;

    const questionSet = await repo.pickQuestionSetForUser(userId, {strategy});

    try {
        const created = await repo.createInterview({
            userId,
            questionSetId: questionSet.id,
            day,
            createQuestionsFromSet: true,
        });
        return created;
    } catch (err) {
        if (err?.code === "P2002" || (err?.message && err.message.includes("Duplicate"))) {
            const retry = await repo.findInterviewByUserAndDay(userId, day);
            if (retry) return retry;
        }
        throw err;
    }
};