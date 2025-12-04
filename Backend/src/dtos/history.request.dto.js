import { UnauthorizedError } from "../errors.js";

export class GetInterviewHistoryRequestDto {
    constructor(req) {
        this.userId = req.user?.id;
        this.limit = req.query?.limit;
        this.cursorCreatedAt = req.query?.cursorCreatedAt;
        this.cursorId = req.query?.cursorId;
        this.validate();
    }

    validate() {
        if (!this.userId) {
            throw new UnauthorizedError("로그인이 필요합니다.");
        }
    }

    toServicePayload() {
        return {
            userId: this.userId,
            limit: this.limit ? parseInt(this.limit) : 20,
            cursorCreatedAt: this.cursorCreatedAt || null,
            cursorId: this.cursorId || null,
        };
    }
}