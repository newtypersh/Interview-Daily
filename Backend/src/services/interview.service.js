import * as repo from "../repositories/interview.repository.js";
import { enqueueTranscription } from "../workers/transcription.worker.js";
import { ConflictError } from "../errors.js";

export async function startInterview({ userId, strategy = "random" }) {
    // 1. 날짜 정규화 (UTC 기준)
    const now = new Date();
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // 2. 오늘의 면접이 이미 존재하는지 확인 (1차 체크)
    const existing = await repo.findInterviewByUserAndDay(userId, day);
    if (existing) {
        throw new ConflictError("오늘의 면접이 이미 생성되었습니다.");
    } 

    // 3. 질문 세트 선정
    const questionSet = await repo.pickQuestionSetForUser(userId, {strategy});

    // 4. 면접 생성 및 동시성 제어 (2차 체크)
    try {
        const created = await repo.createInterview({
            userId,
            questionSetId: questionSet.id,
            day,
        });
        return created;
    } catch (err) {
        if (err?.code === "P2002" || (err?.message && err.message.includes("Duplicate"))) {
            throw new ConflictError("오늘의 면접이 이미 생성되었습니다.");
        }
        throw err;
    }
};

export async function upsertInterviewAnswer({ interviewId, userId, interviewAnswerId, questionId, sequence, audio_url }) {
    return repo.upsertInterviewAnswer({ interviewId, userId, interviewAnswerId, questionId, sequence, audio_url });
}

export async function getInterviewById({ interviewId, userId }) {
    return repo.getInterviewById({ interviewId, userId });
}

export async function getInterviewAnswers({ interviewId, userId }) {
    return repo.getInterviewAnswers({ interviewId, userId });
}

export async function updateAnswerAudio({ interviewId, answerId, userId, audioUrl }) {
  // 1. 소유자 & 일치 검증
  await repo.assertInterviewAndAnswerOwnership({ interviewId, answerId, userId });
  
  // 2. DB 업데이트 (audio_url 저장)
  await repo.updateInterviewAnswerAudio({ answerId, audioUrl });
  
  // 3. STT 변환 대기
  let transcript = "";
  try {
    transcript = await enqueueTranscription({ answerId: String(answerId), audioUrl });
  } catch (err) {
    console.error(`[STT Error] AnswerID: ${answerId}`, err);
    transcript = "변환에 실패했습니다.";
  }

  const updatedAnswer = await repo.updateInterviewAnswerTranscriptText({ 
    answerId, transcriptText: transcript 
});

  return updatedAnswer;
}