import { Request } from "express";
import { UnauthorizedError } from "../errors.js";

export class GetInterviewHistoryRequestDto {
    userId: string | undefined;
    limit: number;
    cursorCreatedAt: string | undefined;

    constructor(req: Request) {
        this.userId = (req.user as any)?.id;
        
        // Zod middleware has already transformed these types
        const query = req.query as any;
        this.limit = query.limit; 
        this.cursorCreatedAt = query.cursorCreatedAt;

        // Basic auth check
        if (!this.userId) {
            throw new UnauthorizedError("로그인이 필요합니다.");
        }
    }

    toServicePayload() {
        return {
            userId: this.userId!,
            limit: this.limit,
            cursorCreatedAt: this.cursorCreatedAt || null,
        };
    }
}