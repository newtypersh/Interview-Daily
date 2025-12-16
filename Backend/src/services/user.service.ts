import { prisma } from "../db.config.js";
import * as userRepository from "../repositories/user.repository.js";
import { userDto } from "../dtos/user.dto.js";
import { NotFoundError } from "../errors.js";
import { QuestionCategory, FeedbackCategory } from "@prisma/client";

/**
 * 새 사용자를 생성하고 기본 질문세트, 질문들, 피드백 템플릿을 함께 생성합니다.
 * - 트랜잭션으로 묶어 원자성 보장
 * - 기본 세트/질문 내용은 필요에 맞게 수정하세요 (스키마 필드에 맞게)
 */
export async function createUserAndDefaults({ email, name }: { email: string; name: string }) {
  const now = new Date();

  return await prisma.$transaction(async (tx) => {
    // 1) user 생성
    const user = await tx.user.create({
      data: {
        email,
        name,
        created_at: now,
        updated_at: now,
      },
    });

    // 2) 기본 질문 세트 정의
    const defaultSets = [
      {
        name: "직무역량 기본 질문",
        category: QuestionCategory.JOB,
        questions: [
          { content: "1분 자기소개 시작해주세요", order: 1 },
          { content: "방금 1분자기소개서에서 말한 1번째 경험을 어떻게 진행했나요?", order: 2 },
          { content: "무엇을 근거로 그 액션을 하게 되었나요?", order: 3 },
          { content: "직무에 있어 내 강점이 있다면 무엇인가요?", order: 4 },
          { content: "그 직무가 무슨 일을 하는지 아나요?", order: 5 },
          { content: "최근 직무 관련 해서 최근 이슈가 뭔가요?", order: 6 },
          { content: "입사후 어떤 일을 가장 먼저 제안하고 싶나요?", order: 7 },
        ],
      },
      {
        name: "직무역량 기본 질문 2",
        category: QuestionCategory.JOB,
        questions: [
          { content: "1분 자기소개 시작해주세요", order: 1 },
          { content: "입사를 위해 어떤 준비를 하셨나요?", order: 2 },
          { content: "그 때 당시 냈던 성과가 있나요?", order: 3 },
          { content: "그 경험들 중에서 나의 강점을 가장 잘 반영한 업무는 무엇인가요?", order: 4 },
          { content: "우리 회사에 대해 한마디로 정의해보세요", order: 5 },
          { content: "앞서 말한 경험들이 우리 회사에 어떻게 기여할 수 있을까요?", order: 6 },
          { content: "합격하면 거주는 어떻게 하실거에요?", order: 7 },
        ],
      },
      {
        name: "직무역량 기본 질문 3",
        category: QuestionCategory.JOB,
        questions: [
          { content: "1분 자기소개 시작해주세요", order: 1 },
          { content: "이력서를 보니 관련경험들이 지원직무랑 연관성이 없어보이는데 이 직무에 지원하게 된 계기가 무엇인가요?", order: 2 },
          { content: "관련회사가 많은데 왜 우리 회사에 지원하게 되었나요?", order: 3 },
          { content: "입사 후 다른 직무를 맡게 된다면 어떻게 하실 건가요?", order: 4 },
        ],
      },
      {
        name: "비즈니스 인성 질문 세트",
        category: QuestionCategory.PERSONAL,
        questions: [
          { content: "1분 자기소개 시작해주세요", order: 1 },
          { content: "1분 자기소개에서 말씀주신 경험에서 문제점 파악을 어떻게 했나요?", order: 2 },
          { content: "그 문제를 왜 그 방법으로 해결하려고 하셨나요?", order: 3 },
          { content: "친구들이 말하는 지원자님의 장점은 무엇인가요?", order: 4 },
          { content: "그럼 본인 성격의 단점은 뭐라고 생각하나요?", order: 5 },
          { content: "업무 특성상 클라이언트/부서간 상대하다보면 갈등상황이 발생할 수 있는데 관련한 경험이 있나요?", order: 6 },
          { content: "똑같은 상황이 발생한다면 어떻게 하시겠어요?", order: 7 },
          { content: "스트레스 관리는 어떻게 하세요?", order: 8 },
        ],
      },
      {
        name: "공백기 질문 세트",
        category: QuestionCategory.PERSONAL,
        questions: [
          { content: "1분 자기소개 시작해주세요", order: 1 },
          { content: "취미가 무엇인가요?", order: 2 },
          { content: "대학 때 학업 관련된 것 말고 젤 열심히 한 것이 있다면 무엇인가요?", order: 3 },
          { content: "왜 그사이 최종 합격이 안되셨다고 생각하세요?", order: 4 },
          { content: "학교 다닐 때 무슨 과목 좋아했나요?", order: 5 },
          { content: "전공하고 우리 직무랑 큰 관련이 없어보이는데 왜 이 직무를 하고 싶으신건가요?", order: 6 },
          { content: "우리 회사에 대해 아는대로 말해주세요", order: 7 },
        ],
      },
      {
        name: "커뮤니케이션 및 협업 질문 세트",
        category: QuestionCategory.PERSONAL,
        questions: [
          { content: "1분 자기소개 시작해주세요", order: 1 },
          { content: "팀에서 가장 어려운 협업 경험은 무엇이었나요?", order: 2 },
          { content: "그 상황에서 팀원들과 어떻게 조율하셨나요?", order: 3 },
          { content: "반대 의견을 가진 동료나 상사를 설득해 본 경험이 있나요? 없다면 앞으로 그런 상황이 생긴다면 어떻게 하실 건가요?", order: 4 },
          { content: "본인의 협업 스타일을 한 단어로 표현한다면 무엇인가요?", order: 5 },
          { content: "본인의 의견이 받아들여지지 않은 경험이 있다면, 그때 어떻게 대처하셨나요? 만약 없다면 앞으로 그런 상황이 생겼을 때 어떻게 하실 건가요?", order: 6 },
        ],
      },
      {
        name: "지원동기 기본 질문",
        category: QuestionCategory.MOTIVATION,
        questions: [
          { content: "1분 자기소개 시작해주세요", order: 1 },
          { content: "우리 회사에 대해 아는대로 이야기 해주세요.", order: 2 },
          { content: "저희 회사 서비스를 이용해보신적이 있으신가요? (서비스가 없다면) 저희 회사 기술에 대해 아시는대로 이야기해주세요", order: 3 },
          { content: "저희 회사 경쟁사가 어디라고 생각하세요?", order: 4 },
          { content: "우리가 잘하고 있는점은 뭐고, 거기가 잘하는 점이 뭐라고 생각하세요?", order: 5 },
          { content: "저희 회사 제외하고 지원하신 곳은 어디신가요? 붙으신다면 가장 가고 싶은 회사가 어디세요?", order: 6 },
        ],
      },
      {
        name: "지원동기 기본 질문 2",
        category: QuestionCategory.MOTIVATION,
        questions: [
          { content: "1분 자기소개 시작해주세요", order: 1 },
          { content: "지원자님이 생각하시는 OOO(지원직무)란 무엇이라고 설명할 수 있나요?", order: 2 },
          { content: "그 직무를 꼭 우리회사에서 해야할 이유가 있나요?", order: 3 },
          { content: "입사하신다면 뭐부터 하자고 제안하시겠어요?", order: 4 },
          { content: "만약 우리 회사 떨어지면 어디가실 생각이세요?", order: 5 },
          { content: "입사했는데 지원하신 직무가 아니라 다른직무로 제안받으신다면 어떻게 하실건가요?", order: 6 },
        ],
      }
    ];

    // 3) questionSet & question 생성 (nested write 사용)
    for (const set of defaultSets) {
      await tx.questionSet.create({
        data: {
          user_id: user.id,
          name: set.name,         
          category: set.category,
          created_at: now,
          updated_at: now,
          questions: {
            create: set.questions.map((q) => ({
              content: q.content, 
              order: q.order,
              created_at: now,
              updated_at: now,
            })),
          },
        },
      });
    }

    // 4) 기본 피드백 템플릿 정의 (마크다운 형식)
    const defaultFeedbackTemplates = [
      {
        category: FeedbackCategory.JOB,
        template_text: `## 1. 직무역량 질문에 대해 두괄식으로 답변을 하고 있나요?

## 2. 질문에 대한 대답을 본인의 필살기 경험으로 대답하고 있나요?

## 3. 경험의 내용이 수치화 혹은 구체화 되어 있나요?

`,
      },
      {
        category: FeedbackCategory.PERSONAL,
        template_text: `## 1. 질문에 대한 답변이 구체적인 경험을 기반으로 하고 있나요?

## 2. 아쉽거나 보완하고 싶은 답변이 있다면 무엇이고, 어떻게 보완하면 좋을까요?

## 3. 질문에 대한 대답을 먼저 대답한 후 구체적인 설명을 하고 있나요?

`,
      },
      {
        category: FeedbackCategory.MOTIVATION,
        template_text: `## 1. 답변에 기업/직무에 대한 분석이 수치화와 함께 잘 반영되었나요?

## 2. 본인의 경험을 최대한 포함하여 답변했나요?

## 3. 답변을 두괄식으로 잘 설명했나요?

`,
      },
    ];

    // 5) feedbackTemplate 생성
    for (const template of defaultFeedbackTemplates) {
      await tx.feedbackTemplate.create({
        data: {
          user_id: user.id,
          category: template.category,
          template_text: template.template_text,
          created_at: now,
          updated_at: now,
        },
      });
    }

    return user;
  });
}

export const getUserProfile = async (userId: string | number | bigint) => {
  const user =  await userRepository.findUserById(userId);

  if (!user) {
    throw new NotFoundError("존재하지 않는 사용자입니다.");
  }

  return userDto(user);
}