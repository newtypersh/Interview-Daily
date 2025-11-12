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
