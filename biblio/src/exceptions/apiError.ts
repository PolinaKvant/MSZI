export default class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnathorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static BadRequest(message: string, errors = []) {
    return new ApiError(400, message, errors);
  }

  static InternalError(message: string) {
    return new ApiError(
      500,
      `Внутренняя ошибка сервера: ${message || "Без сообщения"}`
    );
  }
}
