import TokenModel from "@/database/models/TokenModel";
import UserDto from "@/dtos/userDto";
import jwt from "jsonwebtoken";

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

export default class TokenService {
  /**
   * Генерирует токен доступа и токен обновления на основе данных пользователя.
   *
   * @param {UserDto} payload - Данные пользователя.
   * @returns {Promise<{accessToken: string, refreshToken: string}>} - Объект с генерированными токенами.
   * @throws {Error} - Если не удалось генерировать токены.
   */
  static async generateTokens(payload: UserDto) {
    try {
      if (!JWT_ACCESS_SECRET)
        throw new Error("JWT_ACCESS_SECRET is not defined");
      if (!JWT_REFRESH_SECRET)
        throw new Error("JWT_REFRESH_SECRET is not defined");

      await TokenModel.destroy({ where: { userId: payload.id } });

      const refreshToken = await jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: "30d",
      });
      const accessToken = await jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: "30s",
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new Error(e as string);
    }
  }

  /**
   * Верифицирует токен доступа.
   *
   * @param {string} token - Токен доступа.
   * @returns {UserDto} - Данные пользователя, если токен является валидным, иначе - ошибка.
   * @throws {Error} - Если токен является невалидным.
   */
  static verifyAccessToken(token: string): UserDto {
    try {
      if (!JWT_ACCESS_SECRET)
        throw new Error("JWT_ACCESS_SECRET is not defined");
      return jwt.verify(token, JWT_ACCESS_SECRET) as UserDto;
    } catch {
      throw new Error("Failed to verify access token");
    }
  }

  /**
   * Верифицирует токен обновления.
   *
   * @param {string} token - Токен обновления.
   * @returns {UserDto} - Данные пользователя, если токен является валидным, иначе - ошибка.
   * @throws {Error} - Если токен является невалидным.
   */
  static async verifyRefreshToken(token: string): Promise<UserDto> {
    try {
      if (!JWT_REFRESH_SECRET)
        throw new Error("JWT_REFRESH_SECRET is not defined");
      const tokenFromDb = await TokenModel.findOne({ where: { token } });
      if (!tokenFromDb) throw new Error("Token not found");
      return jwt.verify(token, JWT_REFRESH_SECRET) as UserDto;
    } catch {
      throw new Error("Failed to verify refresh token");
    }
  }

  /**
   * Сохраняет токен в базе данных.
   *
   * @param {number} userId - ID пользователя, которому принадлежит токен.
   * @param {string} token - Токен, который необходимо сохранить.
   * @throws {Error} - Если не удалось сохранить токен.
   */
  static async saveToken(userId: number, token: string) {
    try {
      await TokenModel.create({ token, userId });
    } catch {
      throw new Error("Failed to save token");
    }
  }

  /**
   * Удаляет токен из базы данных.
   *
   * @param {string} token - Токен, который необходимо удалить.
   * @throws {Error} - Если не удалось удалить токен.
   */
  static async removeToken(token: string) {
    try {
      await TokenModel.destroy({ where: { token } });
    } catch {
      throw new Error("Failed to remove token");
    }
  }

  /**
   * Находит токен в базе данных.
   *
   * @param {string} token - Токен, который необходимо найти.
   * @returns {Promise<TokenModel | null>} - Объект токена, если найден, иначе null.
   * @throws {Error} - Если не удалось найти токен.
   */
  static async findToken(token: string): Promise<TokenModel> {
    try {
      console.log("asdasd ", token);
      const tokenModel = await TokenModel.findOne({ where: { token: token } });
      if (!tokenModel) throw new Error("Token not found");
      return tokenModel;
    } catch (e) {
      if (e) throw new Error(e as string);
      throw new Error("Failed to find token");
    }
  }
}
