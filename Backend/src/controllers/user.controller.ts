import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as userService from "../services/user.service.js";

export const getMyInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;

    const userDto = await userService.getUserProfile(userId);

    return res.status(StatusCodes.OK).success(userDto);

  } catch (err) {
    next(err);
  }
};