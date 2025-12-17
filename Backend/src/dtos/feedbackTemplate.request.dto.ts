import { Request } from "express";
import { BadRequestError, UnauthorizedError } from "../errors.js";

// GET /api/feedback-templates 요청 DTO
export class GetFeedbackTemplatesRequestDto {
  userId: string | undefined;
  path: string;

  constructor(req: Request) {
    // raw 데이터 추출
    this.userId = (req.user as any)?.id;
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
      userId: this.userId!,
    };
  }
}

// GET /api/feedback-templates/:category 요청 DTO
export class GetFeedbackTemplatesByCategoryRequestDto extends GetFeedbackTemplatesRequestDto {
  category: string;

  constructor(req: Request) {
    super(req);
    this.category = req.params?.category;
    
    // Zod validates and transforms category enum
    this.category = req.params?.category;
  }

  toServicePayload() {
    return {
      userId: this.userId!,
      category: this.category,
    };
  }
}

// PATCH /api/feedback-templates/:category 요청 DTO
export class UpdateFeedbackTemplateRequestDto {
  userId: string | undefined;
  category: string;
  content: string;

  constructor(req: Request) {
    this.userId = (req.user as any)?.id;
    this.category = req.params?.category;
    this.content = req.body?.content;
    
    // Basic auth check only (if not covered by middleware fully for DTO)
    if (!this.userId) throw new UnauthorizedError("로그인이 필요합니다.");
  }

  toServicePayload() {
    return {
      userId: this.userId!,
      category: this.category,
      content: this.content,
    };
  }
}