import { NextFunction, Response, Request } from "express";
import ApiError from "../exceptions/apiError";
import TokenService from "../services/tokenService";

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.UnathorizedError());
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnathorizedError());
    }
    const userData = TokenService.verifyAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnathorizedError());
    }
    next();
  } catch (error) {
    return next(ApiError.UnathorizedError());
  }
}
