import { prisma } from "../db.config.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../errors.js";
import { Prisma, PrismaClient, InterviewStatus, FeedbackCategory } from "@prisma/client";

type PrismaTx = Prisma.TransactionClient | PrismaClient;

function toBigInt(v: string | number | bigint): bigint {
    if (typeof v === "bigint") return v;
    if (typeof v === "number") return BigInt(v);
    if (typeof v === "string" && /^-?\d+$/.test(v)) return BigInt(v);
    console.error(`[toBigInt] Invalid value: ${v} (Type: ${typeof v})`);
    throw new Error(`invalid id: ${v} (Type: ${typeof v})`);
}

export async function findInterviewByUserAndDay(userId: string | number | bigint, day: Date) {
    const u = toBigInt(userId);
    return prisma.interview.findFirst({
        where: { user_id: u, day },
        include: { answers: { orderBy: { sequence: "asc" } } },
    });
}

export async function pickQuestionSetForUser(userId: string | number | bigint, { strategy }: { strategy: string }) {
    const u = toBigInt(userId);
    let where: Prisma.QuestionSetWhereInput = {};

    if (strategy === "random") {
        where = { user_id: u };
    } else {
        throw new BadRequestError(`지원하지 않는 전략입니다: ${strategy}`, { strategy });
    }

    const sets = await prisma.questionSet.findMany({ where });
    
    if (!sets || sets.length === 0) {
        throw new NotFoundError("사용 가능한 질문 세트가 없습니다.");
    }

    return sets[Math.floor(Math.random() * sets.length)];
}

export async function createInterview({ userId, questionSetId, day }: { userId: string | number | bigint; questionSetId: string | number | bigint; day: Date }) {
    const u = toBigInt(userId);
    const q = toBigInt(questionSetId);

    return prisma.$transaction(async (tx) => {
        const createdInterview = await tx.interview.create({
            data: { 
                user_id: u, 
                question_set_id: q, 
                day, 
                created_at: new Date(), 
                updated_at: new Date() 
            },
        });

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
        
        return tx.interview.findUnique({
            where: { id: createdInterview.id },
            include: { 
                questionSet: { select: { category: true } },
                answers: { 
                    orderBy: { sequence: "asc" },
                    include: { question: true }
                } 
            },
        });
    });
}

export async function upsertInterviewAnswer({ interviewId, userId, interviewAnswerId, questionId, sequence, audio_url }: {
    interviewId: string | number | bigint;
    userId: string | number | bigint;
    interviewAnswerId?: string | number | bigint;
    questionId?: string | number | bigint;
    sequence?: number;
    audio_url?: string;
}) {
    const iId = toBigInt(interviewId);
    const uId = toBigInt(userId);

    const iv = await prisma.interview.findUnique({ where: { id: iId }, select: { user_id: true, question_set_id: true } });
    if (!iv) { const e = new Error("interview not found"); (e as any).statusCode = 404; throw e; }
    if (iv.user_id !== uId) { const e = new Error("forbidden"); (e as any).statusCode = 403; throw e; }

    if (interviewAnswerId) {
        const aId = toBigInt(interviewAnswerId);
        const existing = await prisma.interviewAnswer.findUnique({ where: { id: aId }, select: { interview_id: true } });
        if (!existing || existing.interview_id !== iId) { const e = new Error("answer not found or mismatch"); (e as any).statusCode = 404; throw e; }

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
        if (!questionId) throw new Error("questionId required for creation");
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

export async function findInterviewById(interviewId: string | number | bigint, userId: string | number | bigint) {
    const iId = toBigInt(interviewId);
    const uId = toBigInt(userId);

    const interview = await prisma.interview.findUnique({
        where: { id: iId },
        include: {
            answers: { 
                orderBy: { sequence: "asc" },
                include: { 
                    question: true,
                    feedbacks: true, 
                },
            }
        }
    });

    if (!interview) {
        const e = new Error("Interview not found");
        (e as any).statusCode = 404;
        throw e;
    }
    if (interview.user_id !== uId) {
        const e = new Error("Forbidden");
        (e as any).statusCode = 403;
        throw e;
    }
    return interview;
}

export async function findInterviewAnswers(interviewId: string | number | bigint, userId: string | number | bigint) {
    const iId = toBigInt(interviewId);
    const uId = toBigInt(userId);

    const interview = await prisma.interview.findUnique({ 
        where: { id: iId }, 
            include: {
            questionSet: { select: { category: true } },
            answers: {
                orderBy: { sequence: "asc" },
                include: { question: true },
            }
        }
    });

    if (!interview) {
        const e = new Error("Interview not found");
        (e as any).statusCode = 404;
        throw e;
    }
    if (interview.user_id !== uId) {
        const e = new Error("Forbidden");
        (e as any).statusCode = 403;
        throw e;
    }
    return interview;
}

export async function findFeedbackTemplatesForInterview(interviewId: string | number | bigint, userId: string | number | bigint) {
    const iId = toBigInt(interviewId);
    const uId = toBigInt(userId);

    const iv = await prisma.interview.findUnique({
        where: { id: iId },
        select: { id: true, user_id: true, question_set_id: true },
    });
    if (!iv) { const e = new Error("Interview not found"); (e as any).statusCode = 404; throw e; }
    if (iv.user_id !== uId) { const e = new Error("Forbidden"); (e as any).statusCode = 403; throw e; }

    const qset = await prisma.questionSet.findUnique({
        where: { id: iv.question_set_id },
        select: { id: true, category: true },
    });
    if (!qset) return [];

    const templates = await prisma.feedbackTemplate.findMany({
        where: { category: qset.category },
        orderBy: { created_at: "desc" },
    });
    
    return templates;
};

export async function findInterviewsByUserPaginated(userId: string | number | bigint, { limit = 20, cursorCreatedAt = null }: { limit?: number; cursorCreatedAt?: string | null }) {
    const uId = toBigInt(userId);
    const take = Number(limit) + 1;

    const where: Prisma.InterviewWhereInput = { user_id: uId };

    if (cursorCreatedAt) {
        const cursorDate = new Date(cursorCreatedAt);
        where.created_at = { lt: cursorDate };
    }

    const rows = await prisma.interview.findMany({
        where,
        orderBy: { created_at: "desc" },
        take,
        select: {
            id: true,
            user_id: true,
            question_set_id: true,
            status: true, // Added missing status field
            day: true,
            interviewed_at: true,
            created_at: true,
            updated_at: true,
            answers: {
                select: {
                    feedbacks: {
                        select: { rating: true }
                    }
                }
            },
            _count: { select: { answers: true } },
        },
    });

    let nextCursor = null;
    let items = rows;
    if (rows.length === take) {
        const last = rows[rows.length - 1];

        items = rows.slice(0, -1);
        nextCursor = { createdAt: last.created_at.toISOString() };
    }

    return { items, nextCursor };
}

export async function assertInterviewAndAnswerOwnership({ interviewId, answerId, userId }: { interviewId: string | number | bigint; answerId: string | number | bigint; userId: string | number | bigint }) {
    const aId = toBigInt(answerId);
    const iId = toBigInt(interviewId);
    const uId = toBigInt(userId);

    const answer = await prisma.interviewAnswer.findUnique({
        where: { id: aId },
        select: {
            id: true,
            interview_id: true,
            interview: { select: { user_id: true } },
        },
    });

    if (!answer) {
        throw new NotFoundError("답변을 찾을 수 없습니다.");
    }

    if (answer.interview_id !== iId || answer.interview?.user_id !== uId) {
        throw new ForbiddenError("권한이 없습니다.");
    }

    return true;
}

export async function updateInterviewAnswerAudio({ answerId, audioUrl }: { answerId: string | number | bigint; audioUrl: string }) {
    const aId = toBigInt(answerId);
    return prisma.interviewAnswer.update({
        where: { id: aId },
        data: {
            audio_url: audioUrl,
            updated_at: new Date(),
        },
    });
}

export async function updateInterviewAnswerContent({ answerId, transcriptText }: { answerId: string | number | bigint; transcriptText: string }) {
    const aId = toBigInt(answerId);
    return prisma.interviewAnswer.update({
        where: { id: aId },
        data: {
            transcript_text: transcriptText,
            updated_at: new Date(),
        },
    });
}

export async function updateInterviewStatus({ interviewId, status }: { interviewId: string | number | bigint; status: InterviewStatus }) {
    const iId = toBigInt(interviewId);

    const data: Prisma.InterviewUpdateInput = {
        status: status,
        updated_at: new Date(),
    };

    if (status === "COMPLETED") {
        data.interviewed_at = new Date();
    }

    return prisma.interview.update({
        where: { id: iId },
        data: data,
        include: {
            questionSet: {
                select: { category: true } 
            },
            answers: {
                orderBy: { sequence: "asc" },
                include: {
                    question: { select: { content: true } },
                    feedbacks: true // Added missing feedbacks relation
                }
            }
        }
    });
}

export async function findFeedbackTemplate(userId: string | number | bigint, category: FeedbackCategory) {
    const uId = toBigInt(userId);

    return prisma.feedbackTemplate.findFirst({
        where: { 
            user_id: uId,
            category: category
        },
    });
}

export async function createFeedbacksBulk({ feedbacks }: { feedbacks: { answerId: string; rating: number; feedbackText?: string }[] }) {
    return prisma.$transaction(async (tx) => {
        let count = 0;

        for (const fb of feedbacks) {
            const aId = toBigInt(fb.answerId);

            const answer = await tx.interviewAnswer.findUnique({
                where: { id: aId },
                select: { question_id: true },
            });

            if (!answer) {
                throw new NotFoundError(`답변을 찾을 수 없습니다. (ID: ${fb.answerId})`);
            }

            await tx.feedback.create({
                data: {
                    interview_answer_id: aId,
                    question_id: answer.question_id,
                    rating: fb.rating,
                    feedback_text: fb.feedbackText || "",
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            });

            count++;
        }
        return count;
    });
}

export async function findInterviewAnswerById(answerId: string | number | bigint) {
    const aId = toBigInt(answerId);
    return prisma.interviewAnswer.findUnique({
        where: { id: aId }
    });
}