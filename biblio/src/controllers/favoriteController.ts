import FavoriteService from "@/services/favoriteService";
import TokenService from "@/services/tokenService";
import { NextFunction, Request, Response } from "express";

export default class FavoriteController {
  static async addFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const { favorite } = req.body;

      const { refreshToken } = req.cookies;

      const user = await TokenService.verifyRefreshToken(refreshToken);

      await FavoriteService.addFavorite(user.id, favorite);
      return res.status(200).json({ message: "Добавление прошло успешно" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const { favorite } = req.body;

      const { refreshToken } = req.cookies;

      const user = await TokenService.verifyRefreshToken(refreshToken);

      await FavoriteService.deleteFavorite(user.id, favorite);
      return res.status(200).json({ message: "Удаление прошло успешно" });
    } catch (error) {
      next(error);
    }
  }

  static async getFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      const user = await TokenService.verifyRefreshToken(refreshToken);

      const favorites = await FavoriteService.getFavorites(user.id);

      return res.status(200).json(favorites);
    } catch (error) {
      next(error);
    }
  }
}
