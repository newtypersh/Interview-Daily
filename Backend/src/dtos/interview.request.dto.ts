import { Request } from "express";
import { BadRequestError, UnauthorizedError } from "../errors.js";

export class StartInterviewRequestDto {
    userId: string | undefined;
    strategy: string | undefined;

    constructor(req: Request) {
        this.userId = (req.user as any)?.id;
        this.strategy = req.body?.strategy;

        if (!this.userId) {
            throw new UnauthorizedError("로그인이 필요합니다.");
        }
    }

    toServicePayload() {
        return {
            userId: this.userId!,
            strategy: this.strategy,
        };
    }
}

export class UploadAnswerAudioRequestDto {
    userId: string | undefined;
    interviewId: string;
    answerId: string;
    file: any; // Multer file object (S3)

    constructor(req: Request) {
        this.userId = (req.user as any)?.id;
        this.interviewId = req.params?.interviewId;
        this.answerId = req.params?.answerId;
        this.file = (req as any).file;

        if (!this.userId) {
            throw new UnauthorizedError("로그인이 필요합니다.");
        }

        // Zod validates params. File presence check:
        if (!this.file) {
            throw new BadRequestError("오디오 파일이 필요합니다.");
        }
    }

    toServicePayload() {
        return {
            userId: this.userId!,
            interviewId: this.interviewId,
            answerId: this.answerId,
            audioUrl: this.file.location, // S3 업로드 후 반환된 URL
        };
    }
}

export class CompleteInterviewRequestDto {
    userId: string | undefined;
    interviewId: string;

    constructor(req: Request) {
        this.userId = (req.user as any)?.id;
        this.interviewId = req.params?.interviewId;

        if (!this.userId) {
            throw new UnauthorizedError("로그인이 필요합니다.");
        }
    }

    toServicePayload() {
        return {
            userId: this.userId!,
            interviewId: this.interviewId,
        };
    }
}

export class CreateFeedbackRequestDto {
    userId: string | undefined;
    interviewId: string;
    feedbacks: any[];

    constructor(req: Request) {
        this.userId = (req.user as any)?.id;
        this.interviewId = req.params?.interviewId;
        this.feedbacks = req.body?.feedbacks;

        if (!this.userId) throw new UnauthorizedError("로그인이 필요합니다.");
    }

    toServicePayload() {
        return {
            userId: this.userId!,
            interviewId: this.interviewId,
            feedbacks: this.feedbacks.map(f => ({
                interviewAnswerId: f.answerId, // Mapped to Service expected key
                rating: f.rating,
                feedbackText: f.feedbackText || f.comment || "",
            }))
        }
    }
}