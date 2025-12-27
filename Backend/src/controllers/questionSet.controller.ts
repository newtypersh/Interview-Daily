import { NextFunction, Request, Response } from "express";
import * as service from "../services/questionSet.service.js";
import { 
  toListQuestionsRequest,
  toListQuestionSetsRequest,
  toCreateQuestionSetRequest,
  toCreateQuestionRequest,
  toUpdateQuestionSetRequest,
  toUpdateQuestionRequest,
  toDeleteQuestionSetRequest,
  toDeleteQuestionRequest,
  toListItem,
  toQuestionItem
} from "../dtos/questionSet.dto.js";
import { StatusCodes } from "http-status-codes";

// GET /api/question-sets
export const listQuestionSets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.listQuestionSets((req.user as any)?.id);
    return res.status(StatusCodes.OK).success(result.map(toListItem));
  } catch (err) {
    next(err);
  }
};

// GET /api/question-sets/:setId/questions
export const listQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { setId } = toListQuestionsRequest(req);
    const userId = (req.user as any)?.id;

    const items = await service.listQuestions({ userId, setId });

    const result = {
      questionSet: { id: setId },
      items: items.map(toQuestionItem),
    };

    return res.status(StatusCodes.OK).success(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/question-sets 
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opts = toCreateQuestionSetRequest(req);
    const created = await service.createQuestionSet(opts);

    return res.status(StatusCodes.CREATED).success({
      questionSet: toListItem(created),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/question-sets/:setId/questions
export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opts = toCreateQuestionRequest(req);
    const created = await service.createQuestion(opts);

    return res.status(StatusCodes.CREATED).success({ 
      question: toQuestionItem(created) 
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/question-sets/:setId
export const updateQuestionSet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opts = toUpdateQuestionSetRequest(req);
    const updated = await service.updateQuestionSet(opts);

    return res.status(StatusCodes.OK).success({ 
      questionSet: toListItem(updated),
    });
  } catch(err) {
    next(err);
  }
};

// PATCH /api/question-sets/:setId/questions/:questionId
export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opts = toUpdateQuestionRequest(req);
    const updated = await service.updateQuestion(opts);

    return res.status(StatusCodes.OK).success({ 
      question: toQuestionItem(updated), 
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/question-sets/:setId
export const deleteQuestionSet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opts = toDeleteQuestionSetRequest(req);
    await service.deleteQuestionSet(opts);

    return res.status(StatusCodes.OK).success(null);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/question-sets/:setId/questions/:questionId
export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opts = toDeleteQuestionRequest(req);
    await service.deleteQuestion(opts);

    return res.status(StatusCodes.OK).success(null);
  } catch (err) {
    next(err);
  }
};