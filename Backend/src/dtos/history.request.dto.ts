import { Request } from "express";
import { UnauthorizedError } from "../errors.js";

export class GetInterviewHistoryRequestDto {
    userId: string | undefined;
    limit: string | undefined;
    cursorCreatedAt: string | undefined;
    cursorId: string | undefined;

    constructor(req: Request) {
        this.userId = (req.user as any)?.id;
        const query = req.query as any;
        this.limit = query?.limit;
        this.cursorCreatedAt = query?.cursorCreatedAt;
        this.cursorId = query?.cursorId;
        this.validate();
    }

    validate() {
        if (!this.userId) {
            throw new UnauthorizedError("로그인이 필요합니다.");
        }
    }

    toServicePayload() {
        return {
            userId: this.userId!,
            limit: this.limit ? parseInt(this.limit) : 20,
            cursorCreatedAt: this.cursorCreatedAt || null,
            cursorId: this.cursorId || null,
        };
    }
}