import { UnauthorizedError } from "../errors.js";

export class GetInterviewHistoryRequestDto {
    constructor(req) {
        this.userId = req.user?.id;
        this.date = req.query?.date;
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
            date: this.date ? new Date(this.date) : null,
        };
    }
}