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
