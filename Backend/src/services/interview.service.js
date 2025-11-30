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

export async function getInterviewById({ interviewId, userId }) {
    return repo.findInterviewById({ interviewId, userId });
}

export async function getInterviewAnswers({ interviewId, userId }) {
    return repo.findInterviewAnswers({ interviewId, userId });
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

  const updatedAnswer = await repo.updateInterviewAnswerContent({ 
    answerId, transcriptText: transcript 
});

  return updatedAnswer;
}

export async function completeInterview({ interviewId, userId }) {
    // 1. 면접 존재 및 소유자 확인
    const existing = await repo.findInterviewById(interviewId, userId);

    // 2. 상태 업데이트 (IN_PROGRESS -> COMPLETED)
    // 중복 로직 제거: 이미 완료되었더라도 데이터를 받아오기 위해 update를 호출합니다.
    const interview = await repo.updateInterviewStatus({ interviewId, status: 'COMPLETED' });

    // 3. 해당 면접의 카테고리 추출
    const category = interview.questionSet.category;

    // 4. 카테고리에 맞는 피드백 템플릿 조회 (단일 객체 반환)
    const template = await repo.findFeedbackTemplate(userId, category);

    // 5. 프론트엔드에 필요한 데이터 구조로 조합하여 반환
    return {
        id: interview.id,
        status: interview.status,
        category: category,
        answers: interview.answers.map(ans => ({
            id: ans.id,
            sequence: ans.sequence,
            question: ans.question.content,
            audioUrl: ans.audio_url,
            transcript: ans.transcript_text
        })),
        // ✅ 수정: template은 단일 객체이므로 .map() 사용 불가 -> 배열로 감싸기
        templates: template ? [{
            id: template.id,
            content: template.template_text
        }] : []
    };
}