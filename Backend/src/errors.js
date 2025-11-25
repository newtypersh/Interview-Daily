/**
 * 커스텀 에러 클래스들
 * - errorCode, statusCode, reason, data를 담아 전역 에러 핸들러로 전달
 */
export class UnauthorizedError extends Error {
  statusCode = 401;
  errorCode = "UNAUTHORIZED";

  constructor(reason = "로그인이 필요합니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  errorCode = "NOT_FOUND";

  constructor(reason = "리소스를 찾을 수 없습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  errorCode = "FORBIDDEN";

  constructor(reason = "권한이 없습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class BadRequestError extends Error {
  statusCode = 400;
  errorCode = "BAD_REQUEST";

  constructor(reason = "잘못된 요청입니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}