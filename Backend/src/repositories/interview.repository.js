import { prisma } from "../db.config.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../errors.js";

function toBigInt(v) {
    if (typeof v === "bigint") return v;
    if (typeof v === "number") return BigInt(v);
    if (typeof v === "string") return BigInt(v);
    throw new Error("invalid id");
}

export async function findInterviewByUserAndDay(userId, day) {
    // 1. ID 변환
    const u = toBigInt(userId);
    
    // 2. DB 조회: interview 테이블에서 user_id, day 기준으로 조회
    return prisma.interview.findFirst({
        where: { user_id: u, day },
        include: { answers: { orderBy: { sequence: "asc" } } },
    });
}

export async function pickQuestionSetForUser(userId, { strategy }) {
    const u = toBigInt(userId);
    let where = {};

    // 1. 전략에 따른 조건 설정
    if (strategy === "random") {
        where = { user_id: u };
    } else {
        throw new BadRequestError(`지원하지 않는 전략입니다: ${strategy}`, { strategy });
    }

    // 2. 조건에 맞는 세트 조회
    const sets = await prisma.questionSet.findMany({ where });
    
    if (!sets || sets.length === 0) {
        throw new NotFoundError("사용 가능한 질문 세트가 없습니다.");
    }

    // 3. 랜덤 선택 후 반환
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

export async function findInterviewById(interviewId, userId) {
    const iId = toBigInt(interviewId);
    const uId = toBigInt(userId);

    const interview = await prisma.interview.findUnique({
        where: { id: iId },
        include: {
            answers: {
                orderBy: { sequence: "asc" },
                include: { 
                    question: true,
                    feedback: true,
                },
            }
        }
    });

    if (!interview) {
        const e = new Error("Interview not found");
        e.statusCode = 404;
        throw e;
    }
    if (interview.user_id !== uId) {
        const e = new Error("Forbidden");
        e.statusCode = 403;
        throw e;
    }
    return interview;
}

export async function findInterviewAnswers(interviewId, userId) {
    const iId = toBigInt(interviewId);
    const uId = toBigInt(userId);

    const interview = await prisma.interview.findUnique({ 
        where: { id: iId }, 
        include: {
            answers: {
                orderBy: { sequence: "asc" },
                include: { question: true },
            }
        }
    });

    if (!interview) {
    const e = new Error("Interview not found");
    e.statusCode = 404;
    throw e;
  }
  if (interview.user_id !== uId) {
    const e = new Error("Forbidden");
    e.statusCode = 403;
    throw e;
  }
  return interview;
}

export async function findFeedbackTemplatesForInterview(interviewId, userId) {
    const iId = toBigInt(interviewId);
    const uId = toBigInt(userId);

    // 인터뷰 존재 및 소유자 확인, question_set_id 확보
    const iv = await prisma.interview.findUnique({
        where: { id: iId },
        select: { id: true, user_id: true, question_set_id: true },
    });
    if (!iv) { const e = new Error("Interview not found"); e.statusCode = 404; throw e; }
    if (iv.user_id !== uId) { const e = new Error("Forbidden"); e.statusCode = 403; throw e; }

    // questionSet에서 카테고리 확인
    const qset = await prisma.questionSet.findUnique({
        where: { id: iv.question_set_id },
        select: { id: true, category: true },
    });
    if (!qset) return [];

    // 해당 카테고리 템플릿 조회 (필요하면 user specific 조건 추가)
    const templates = await prisma.feedbackTemplate.findMany({
        where: { category: qset.category },
        orderBy: { created_at: "desc" },
    });
    
    return templates;
};

export async function findInterviewsByUserPaginated(userId, { limit = 20, cursorCreatedAt = null, cursorId = null }) {
    const uId = toBigInt(userId);
    const take = Number(limit) + 1;

    const where = { user_id: uId };

    if (cursorCreatedAt && cursorId) {
        const cursorDate = new Date(cursorCreatedAt);
        where.OR = [
            { created_at: { lt: cursorDate } },
            { AND: [ { created_at: cursorDate }, { id: { lt: toBigInt(cursorId) } } ] },
        ];
    }

    const rows = await prisma.interview.findMany({
        where,
        orderBy: [ { created_at: "desc" }, { id: "desc" } ],
        take,
        select: {
            id: true,
            user_id: true,
            question_set_id: true,
            day: true,
            interviewed_at: true,
            day: true,
            interviewed_at: true,
            created_at: true,
            updated_at: true,
            _count: { select: {answers: true} },
        },
    });

    let nextCursor = null;
    let items = rows;
    if (rows.length === take) {
        const last = rows[rows.length - 1];

        items = rows.slice(0, -1);
        nextCursor = { createdAt: last.created_at.toISOString(), id: String(last.id) };
    }

    return { items, nextCursor };
}

export async function assertInterviewAndAnswerOwnership({ interviewId, answerId, userId }) {
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
    const e = new Error("answer not found");
    e.statusCode = 404;
    throw e;
  }

  if (answer.interview_id !== iId || answer.interview.user_id !== uId) {
    const e = new Error("forbidden");
    e.statusCode = 403;
    throw e;
  }

  return true;
}

export async function updateInterviewAnswerAudio({ answerId, audioUrl, size }) {
  const aId = toBigInt(answerId);
  return prisma.interviewAnswer.update({
    where: { id: aId },
    data: {
      audio_url: audioUrl,
      updated_at: new Date(),
    },
  });
}

export async function updateInterviewAnswerTranscriptText({ answerId, transcriptText }) {
  const aId = toBigInt(answerId);
  return prisma.interviewAnswer.update({
    where: { id: aId },
    data: {
      transcript_text: transcriptText,
      updated_at: new Date(),
    },
  });
}