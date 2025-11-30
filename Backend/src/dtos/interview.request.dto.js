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

export class UploadAnswerAudioRequestDto {
    constructor(req) {
        this.userId = req.user?.id;
        this.interviewId = req.params?.interviewId;
        this.answerId = req.params?.answerId;
        this.file = req.file;

        this.validate();
    }

    validate() {
        // 1. 인증 확인
        if (!this.userId) {
            throw new UnauthorizedError("로그인이 필요합니다.");
        }

        // 2. 필수 파라미터 확인
        if (!this.interviewId || !this.answerId) {
            throw new BadRequestError("interviewId와 answerId가 필요합니다.");
        }

        // 3. 파일 존재 확인
        if (!this.file) {
            throw new BadRequestError("오디오 파일이 필요합니다.");
        }
    }

    toServicePayload() {
        return {
            userId: this.userId,
            interviewId: this.interviewId,
            answerId: this.answerId,
            audioUrl: this.file.location, // S3 업로드 후 반환된 URL
        };
    }
}

export class CompleteInterviewRequestDto {
    constructor(req) {
        this.userId = req.user?.id;
        this.interviewId = req.params?.interviewId;

        this.validate();
    }

    validate() {
        if (!this.userId) {
            throw new UnauthorizedError("로그인이 필요합니다.");
        }

        if (!this.interviewId) {
            throw new BadRequestError("interviewId가 필요합니다.");
        }
    }

    toServicePayload() {
        return {
            userId: this.userId,
            interviewId: this.interviewId,
        };
    }
}

export class CreateFeedbackRequestDto {
    constructor(req) {
        this.userId = req.user?.id;
        this.interviewId = req.params?.interviewId;
        this.feedbacks = req.body?.feedbacks;

        this.validate();
    }

    validate() {
        if (!this.userId) throw new UnauthorizedError("로그인이 필요합니다.");
        if (!this.interviewId) throw new BadRequestError("interviewId가 필요합니다.");

        if (!this.feedbacks || !Array.isArray(this.feedbacks) || this.feedbacks.length === 0) {
            throw new BadRequestError("피드백 데이터가 올바르지 않습니다.");
        }

        for (const item of this.feedbacks) {
            if (!item.answerId) throw new BadRequestError("answerId가 누락되었습니다.");
            if (item.rating === undefined || item.rating < 1 || item.rating > 5) {
                throw new BadRequestError("점수는 1에서 5 사이여야 합니다.");
            }
        }
    }

    toServicePayload() {
        return {
            userId: this.userId,
            interviewId: this.interviewId,
            feedbacks: this.feedbacks.map(f => ({
                answerId: f.answerId,
                rating: f.rating,
                feedbackText: f.feedbackText || "",
            }))
        }
    }
}