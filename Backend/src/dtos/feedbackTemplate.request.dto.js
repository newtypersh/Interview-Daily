import { BadRequestError, UnauthorizedError } from "../errors.js";


// GET /api/feedback-templates 요청 DTO
export class GetFeedbackTemplatesRequestDto {
  constructor(req) {
    // raw 데이터 추출
    this.userId = req.user?.id;
    this.category = req.query?.category;
    this.path = req.path;
    
    // 유효성 검증 및 정규화 실행
    this.validate();
    this.normalize();
  }


  //유효성 검증
  validate() {
    // 1. 인증 확인
    if (!this.userId) {
      throw new UnauthorizedError("로그인이 필요합니다.", { path: this.path });
    }

    // 2. category 검증 (선택적 필드)
    if (this.category != null) {
      const allowed = ["JOB", "PERSONAL", "MOTIVATION"];
      const upperCategory = String(this.category).toUpperCase();
      
      if (!allowed.includes(upperCategory)) {
        throw new BadRequestError(
          `category는 ${allowed.join(", ")} 중 하나여야 합니다.`,
          { category: this.category, allowed }
        );
      }
    }

    return true;
  }

  // 데이터 정규화
  normalize() {
    // category를 대문자로 변환 (있는 경우만)
    if (this.category != null) {
      this.category = String(this.category).toUpperCase();
    }
  }

  // 서비스 레이어로 전달할 payload 변환   
  toServicePayload() {
    return {
      userId: this.userId,
      category: this.category ?? undefined, // null이면 undefined로
    };
  }
}

// PATCH /api/feedback-templates/:templateId 요청 DTO
export class UpdateFeedbackTemplateRequestDto {
  constructor(req) {
    this.userId = req.user?.id;
    this.templateId = req.params?.templateId;
    this.content = req.body?.content;
    
    this.validate();
    this.normalize();
  }

  validate() {
    // 인증 확인
    if (!this.userId) {
      throw new UnauthorizedError("로그인이 필요합니다.");
    }

    // templateId 확인
    const id = Number(this.templateId);
    if (Number.isNaN(id)) {
      throw new BadRequestError("templateId는 숫자여야 합니다.", { 
        templateId: this.templateId 
      });
    }

    // content 확인
    if (!this.content || typeof this.content !== 'string') {
      throw new BadRequestError("content가 필요합니다.");
    }

    const trimmed = this.content.trim();
    if (trimmed.length === 0) {
      throw new BadRequestError("content가 비어있습니다.");
    }

    if (trimmed.length > 1000) {
      throw new BadRequestError("content는 최대 1000자까지 가능합니다.", {
        length: trimmed.length,
        maxLength: 1000
      });
    }

    return true;
  }

  normalize() {
    // templateId를 숫자로 변환
    this.templateId = Number(this.templateId);
    
    // content trim
    this.content = this.content.trim();
  }

  toServicePayload() {
    return {
      userId: this.userId,
      templateId: this.templateId,
      content: this.content,
    };
  }
}