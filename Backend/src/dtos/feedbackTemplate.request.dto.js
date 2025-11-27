import { BadRequestError, UnauthorizedError } from "../errors.js";


// GET /api/feedback-templates 요청 DTO
export class GetFeedbackTemplatesRequestDto {
  constructor(req) {
    // raw 데이터 추출
    this.userId = req.user?.id;
    this.path = req.path;
    
    // 유효성 검증 및 정규화 실행
    this.validate();
  } 


  //유효성 검증
  validate() {
    // 1. 인증 확인
    if (!this.userId) {
      throw new UnauthorizedError("로그인이 필요합니다.", { path: this.path });
    }
    return true;
  }

  // 서비스 레이어로 전달할 payload 변환   
  toServicePayload() {
    return {
      userId: this.userId,
    };
  }
}

// GET /api/feedback-templates/:category 요청 DTO
export class GetFeedbackTemplatesByCategoryRequestDto extends GetFeedbackTemplatesRequestDto {
  constructor(req) {
    super(req);
    this.category = req.params?.category;
    
    this.validateCategory();
    this.normalize();
  }

  validateCategory() {
    if (!this.category) {
      throw new BadRequestError("category가 필요합니다.", { path: this.path });
    }

    const allowed = ["JOB", "PERSONAL", "MOTIVATION"];
    const upperCategory = String(this.category).toUpperCase();

    if (!allowed.includes(upperCategory)) {
      throw new BadRequestError(
        `category는 (${allowed.join(", ")}) 중 하나여야 합니다.`, 
        { category: this.category, allowed }
      );
    }
  }

  normalize() {
    this.category = String(this.category).toUpperCase();
  }

  toServicePayload() {
    return {
      userId: this.userId,
      category: this.category,
    };
  }
}

// PATCH /api/feedback-templates/:category 요청 DTO
export class UpdateFeedbackTemplateRequestDto {
  constructor(req) {
    this.userId = req.user?.id;
    this.category = req.params?.category;
    this.content = req.body?.content;
    
    this.validate();
    this.normalize();
  }

  validate() {
    // 인증 확인
    if (!this.userId) throw new UnauthorizedError("로그인이 필요합니다.");
    
    // 2. 카테고리 존재 여부 확인 (추가됨)
    if (!this.category) {
        throw new BadRequestError("category 파라미터가 필요합니다.");
    }

    // 카테고리 검즘
    const allowed = ["JOB", "PERSONAL", "MOTIVATION"];
    const upperCategory = String(this.category).toUpperCase();
    if (!allowed.includes(upperCategory)) {
      throw new BadRequestError(
        `유효하지 않은 카테고리입니다. (${allowed.join(", ")})`,
        { category: this.category, allowed: allowed }
      );
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
    this.category = String(this.category).toUpperCase();
    this.content = this.content.trim();
  }

  toServicePayload() {
    return {
      userId: this.userId,
      category: this.category,
      content: this.content,
    };
  }
}