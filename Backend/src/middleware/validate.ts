import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { BadRequestError } from "../errors.js";

export const validate = (schema: ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 모든 요청 데이터를 하나의 객체로 묶어 스키마에 전달
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      return next(); // 검증 성공 시
    } catch (error) { // 검증 실패 시 에러 처리
      if (error instanceof ZodError) {
        // Collect all error messages
        const messages = error.issues.map((issue) => {
             // If validation is on 'body.name', path is ['body', 'name']
             // We format it as "name: message"
             const path = issue.path.slice(1).join('.'); 
             return `${path ? path + ': ' : ''}${issue.message}`;
        }).join(', ');
        
        return next(new BadRequestError(messages, error.flatten().fieldErrors));
      }
      return next(error);
    }
  };
