import * as service from "../services/questionSet.service.js";
import { toListItem, toQuestionItem } from "../dtos/questionSet.dto.js";

export const list = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const { items, total } = await service.listQuestionSets(userId);

    const result = {
      items: items.map(toListItem),
      total,
    };

    return res.success(result);
  } catch (err) {
    next(err);
  }
};

export const listQuestions = async (req, res, next) => {
  try {
    const setId = Number(req.params.setId);
    if (Number.isNaN(setId)) {
      return res.error({ errorCode: "invalid_param", reason: "setId must be a number" });
    }

    const { items, total } = await service.listQuestions(setId);

    const result = {
      questionSet: { id: Number(setId) },
      items: items.map(toQuestionItem),
      total,
    };

    return res.success(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/question-sets 
export const create = async (req, res, next) => {
  try {
    const user = req.user;
    if(!user || !user.id) {
      return res.error({ errorCode: "unauthorized", reason: "로그인이 필요합니다." });
    }

    const { name, category } = req.body ?? {};
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.error({ errorCode: "invalid_param", reason: "name(1~20자)이 필요합니다." });
    }
    const trimmedName = name.trim();
    if (trimmedName.length > 20) {
      return res.error({ errorCode: "invalid_param", reason: "name은 최대 20자입니다." });
    }

    const allowedCategories = ["JOB", "PERSONAL", "MOTIVATION"];
    if (!category || !allowedCategories.includes(category)) {
      return res.error({ errorCode: "invalid_param", reason: `category는 ${allowedCategories.join(", ")} 중 하나여야 합니다.` });
    }

    const created = await service.createQuestionSet({ userId: user.id, name: trimmedName, category });

    return res.success({ questionSet: toListItem(created) });
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