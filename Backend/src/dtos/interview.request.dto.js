import { BadRequestError, UnauthorizedError } from "../errors";

export class StartInterviewRequestDto {
    constructor(req) {
        this.userId = req.user?.id;
        this.strategy = req.body?.strategy;

        this.validate();
        this.normalize();   
    }

    validate() {
        if (!this.userId) {
            throw new UnauthorizedError("로그인이 필요합니다.");
        }

        if (this.strategy && !["random", "JOB", "PERSONAL", "MOTIVATION"].includes(this.strategy)) {
            throw new BadRequestError("유효하지 않은 strategy입니다.");
        }
    }

    normalize() {
        if (!this.strategy) {
            this.strategy = "random";
        }
    }

    toServicePayload() {
        return {
            userId: this.userId,
            strategy: this.strategy,
        };
    }
}