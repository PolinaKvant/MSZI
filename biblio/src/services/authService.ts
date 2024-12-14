import UserModel, { UserAttributes } from "@/database/models/UserModel";
import UserDto from "@/dtos/userDto";
import bcrypt from "bcrypt";
import TokenService from "./tokenService";
import ApiError from "@/exceptions/apiError";

export default class AuthService {
  /**
   * Регистрация нового пользователя в системе.
   *
   * @param {Pick<UserAttributes, "email" | "password" | "name">} user - Данные нового пользователя.
   * @returns {Promise<{tokens: {accessToken: string, refreshToken: string}, user: UserDto}>} - Объект с токенами и данными пользователя.
   * @throws {ApiError} - Если пользователь с таким email уже существует.
   */
  static async register(
    user: Pick<UserAttributes, "email" | "password" | "name">
  ) {
    try {
      const candidate = await UserModel.findOne({
        where: { email: user.email },
      });
      if (candidate) {
        throw ApiError.BadRequest("User already exists");
      }
      const hash = await bcrypt.hash(user.password, 5);
      const newUser = await UserModel.create({ ...user, password: hash });
      const userDto = new UserDto(newUser);
      const tokens = await TokenService.generateTokens({ ...userDto });
      await TokenService.saveToken(userDto.id, tokens.refreshToken);

      return {
        tokens,
        user: userDto,
      };
    } catch (e) {
      throw new Error(e as string);
    }
  }

  static async login(user: Pick<UserAttributes, "email" | "password">) {
    try {
      const candidate = await UserModel.findOne({
        where: { email: user.email },
      });
      if (!candidate) {
        throw new Error("User not found");
      }
      const isPasswordCorrect = await bcrypt.compare(
        user.password,
        candidate.password
      );
      if (!isPasswordCorrect) {
        throw new Error("Invalid password");
      }

      const userDto = new UserDto(candidate);
      const tokens = await TokenService.generateTokens({ ...userDto });
      await TokenService.saveToken(userDto.id, tokens.refreshToken);

      return {
        tokens,
        user: userDto,
      };
    } catch (e) {
      throw new Error(e as string);
    }
  }

  static async logout(refreshToken: string) {
    try {
      await TokenService.removeToken(refreshToken);
    } catch (e) {
      throw new Error(e as string);
    }
  }

  static async refresh(refreshToken: string) {
    try {
      const userToken = await TokenService.verifyRefreshToken(refreshToken);
      const tokenFromDb = await TokenService.findToken(refreshToken);
      if (!userToken || !tokenFromDb) {
        throw ApiError.UnathorizedError();
      }
      const user = await UserModel.findOne({
        where: { id: tokenFromDb.userId },
      });
      if (!user) {
        throw ApiError.InternalError(
          "Токен найден в базе данных но пользователь не найден"
        );
      }
      await TokenService.removeToken(refreshToken);
      const userDto = new UserDto(user);
      const tokens = await TokenService.generateTokens({ ...userDto });
      await TokenService.saveToken(userDto.id, tokens.refreshToken);

      return {
        tokens,
        user: userDto,
      };
    } catch (e) {
      throw new Error(e as string);
    }
  }
}
