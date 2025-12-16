import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors.js";

export function ensureAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  throw new UnauthorizedError();
}