import * as service from "../services/questionSet.service.js";
import { toListQuestionsRequest, toListItem, toQuestionItem } from "../dtos/questionSet.dto.js";
import { StatusCodes } from "http-status-codes";

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
    const user = req.user;
    if(!user || !user.id) {
      return res.error({ errorCode: "unauthorized", reason: "로그인이 필요합니다." });
    }

    const setIdRaw = req.params.setId;
    if(!setIdRaw) {
      return res.error({ errorCode: "invalid_param", reason: "setId가 필요합니다." });
    }

    const content = req.body?.content;
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return res.error({ errorCode: "invalid_param", reason: "content가 필요합니다." });
    }

    const orderRaw = req.body?.order;
    const order = orderRaw == null ? null : Number(orderRaw);
    if (orderRaw != null && Number.isNaN(order)) {
      return res.error({ errorCode: "invalid_param", reason: "order는 숫자여야 합니다." });
    }

    const created = await service.createQuestion(setIdRaw, {
      content: content.trim(),
      order,
      createdBy: user.id,
    });

    return res.success({ question: toQuestionItem(created) });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/question-sets/:setId
export const updateQuestionSet = async (req, res, next) => {
  try {
    const user = req.user;
    if(!user || !user.id) return res.error({ errorCode: "unauthorized", reason: "로그인이 필요합니다." });

    const setId = req.params.setId;
    if(!setId) return res.error({ errorCode: "invalid_param", reason: "setId가 필요합니다." });

    const { name, category } = req.body ?? {};
    const data = {};
    if (name != null) {
      const t = String(name).trim();
      if(t.length === 0 || t.length > 20) return res.error({ errorCode: "invalid_param", reason: "name은 1~20자 사이여야 합니다." });
      data.name = t;
    }
    if (category != null) {
      const allowed = ["JOB", "PERSONAL", "MOTIVATION"];
      if (!allowed.includes(category)) return res.error({ errorCode: "invalid_param", reason: `category는 ${allowed.join(", ")} 중 하나여야 합니다.` });
      data.category = category;
    }
    if (Object.keys(data).length === 0) return res.error({ errorCode: "invalid_param", reason: "수정할 필드를 하나 이상 제공하세요." });

    const updated = await service.updateQuestionSet(setId, { userId: user.id, ...data });
    return res.success({ questionSet: toListItem(updated) });
  } catch(err) {
    next(err);
  }
};

// PATCH /api/question-sets/:setId/questions/:questionId
export const updateQuestion = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.error({ errorCode: "unauthorized", reason: "로그인이 필요합니다." });
    }

    const { setId, questionId } = req.params;
    if (!setId || !questionId) {
      return res.error({ errorCode: "invalid_param", reason: "setId와 questionId가 필요합니다." });
    }

    const { content, order } = req.body ?? {};
    const data = {};
    if (content != null) {
      const c = String(content).trim();
      if (c.length === 0) return res.error({ errorCode: "invalid_param", reason: "content가 비어있습니다." });
      data.content = c;
    }
    if (order != null) {
      const o = Number(order);
      if (Number.isNaN(o)) return res.error({ errorCode: "invalid_param", reason: "order는 숫자여야 합니다." });
      data.order = o;
    }

    if (Object.keys(data).length === 0) {
      return res.error({ errorCode: "invalid_param", reason: "수정할 필드를 하나 이상 제공하세요." });
    }

    const updated = await service.updateQuestion(setId, questionId, { userId: user.id, ...data });
    return res.success({ question: toQuestionItem(updated) });
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