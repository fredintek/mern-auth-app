export const enum AppErrorCode {
  InvalidAccessToken = "InvalidAccessToken",
  UnknownError = "UnknownError",
}

class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: AppErrorCode;

  constructor(
    statusCode: number,
    message: string,
    errorCode: AppErrorCode = AppErrorCode.UnknownError
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    // stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
