import ApiError from "@/exceptions/apiError";
import AuthService from "@/services/authService";
import TokenService from "@/services/tokenService";
import { NextFunction, Request, Response } from "express";
import validator from "validator";

export default class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || !req.body.email || !req.body.password || !req.body.name)
        throw ApiError.BadRequest("Некорректные данные при регистрации");
      const { email, password, name } = req.body;
      const errors = {
        isEmailValid: validator.isEmail(email),
        isPasswordValid: password.length >= 8,
        isNameValid: validator.isAlpha(name, "ru-RU", { ignore: " " }),
      };

      if (!errors.isEmailValid) {
        return res.status(400).json({ message: "Некорректный email", errors });
      }
      if (!errors.isPasswordValid) {
        return res.status(400).json({ message: "Слабый пароль", errors });
      }
      if (!errors.isNameValid) {
        return res.status(400).json({ message: "Некорректное имя", errors });
      }
      const user = await AuthService.register({ email, password, name });
      res.cookie("refreshToken", user.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .send({ message: "Регистрация прошла успешно", data: user });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const errors = {
        isEmailValid: validator.isEmail(email),
        isPasswordValid: validator.isStrongPassword(password),
      };
      if (!errors.isEmailValid || !errors.isPasswordValid) {
        return res.status(400).json({ message: "Некорректные данные", errors });
      }
      const user = await AuthService.login({ email, password });
      res.cookie("refreshToken", user.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ message: "Авторизация прошла успешно", data: user });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      await AuthService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Выход прошел успешно" });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      const user = await AuthService.refresh(refreshToken);
      res.cookie("refreshToken", user.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ message: "Обновление прошло успешно", data: user });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      const user = await TokenService.verifyRefreshToken(refreshToken);
      return res
        .status(200)
        .json({ message: "Пользователь авторизован", data: user });
    } catch (error) {
      next(error);
    }
  }
}
