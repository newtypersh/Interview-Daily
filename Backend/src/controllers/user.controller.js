import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import * as userService from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));
  
  res.status(StatusCodes.OK).success(user);
};

export const getMyInfo = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userDto = await userService.getUserProfile(userId);

    return res.status(StatusCodes.OK).success(userDto);

  } catch (err) {
    next(err);
  }
};