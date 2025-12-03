import { StatusCodes } from "http-status-codes";
import * as userService from "../services/user.service.js";

export const getMyInfo = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userDto = await userService.getUserProfile(userId);

    return res.status(StatusCodes.OK).success(userDto);

  } catch (err) {
    next(err);
  }
};