import * as service from "../services/questionSet.service.js";
import { 
  toListQuestionsRequest, 
  toCreateQuestionSetRequest,
  toCreateQuestionRequest,
  toUpdateQuestionSetRequest,
  toUpdateQuestionRequest,
  toListItem, 
  toQuestionItem 
} from "../dtos/questionSet.dto.js";
import { StatusCodes } from "http-status-codes";
import { toListQuestionSetsRequest } from "../dtos/interview.dto.js";

// GET /api/question-sets
export const listQuestionSets = async (req, res, next) => {
  try {
    const result = await service.listQuestionSets(req.user.id);
    return res.status(StatusCodes.OK).success(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/question-sets/:setId/questions
export const listQuestions = async (req, res, next) => {
  try {
    const { userId, setId } = toListQuestionsRequest(req);

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
export const create = async (req, res, next) => {
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
export const createQuestion = async (req, res, next) => {
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
export const updateQuestionSet = async (req, res, next) => {
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
export const updateQuestion = async (req, res, next) => {
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
export const deleteQuestionSet = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.error({ errorCode: "unauthorized", reason: "로그인이 필요합니다." });

    const { setId } = req.params;
    if (!setId) return res.error({ errorCode: "invalid_param", reason: "setId가 필요합니다." });

    await service.deleteQuestionSet(setId, user.id);
    return res.success(null);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/question-sets/:setId/questions/:questionId
export const deleteQuestion = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.error({ errorCode: "unauthorized", reason: "로그인이 필요합니다." });

    const { setId, questionId } = req.params;
    if (!setId || !questionId) return res.error({ errorCode: "invalid_param", reason: "setId와 questionId가 필요합니다." });

    await service.deleteQuestion(setId, questionId, { userId: user.id });
    return res.success(null);
  } catch (err) {
    next(err);
  }
};