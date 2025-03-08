import { ErrorRequestHandler, Response } from "express";
import {
  INTERNAL_SERVER_ERROR,
  UNPROCESSABLE_CONTENT,
} from "../constants/http";
import { z } from "zod";
import AppError from "../utils/AppError";
import { clearAuthCookies, REFRESH_COOKIE_PATH } from "../utils/cookies";

const handleZodError = (error: z.ZodError, res: Response) => {
  const errors = error.issues.map((e) => ({
    path: e.path.join("."),
    message: e.message,
  }));
  res.status(UNPROCESSABLE_CONTENT).json({ message: error.message, errors });
};

const handleAppError = (error: AppError, res: Response) => {
  res.status(error.statusCode).json({
    status: "error",
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`Error at ${req.path}:`, error);

  if (req.path === REFRESH_COOKIE_PATH) {
    clearAuthCookies(res);
  }

  if (error instanceof z.ZodError) {
    return handleZodError(error, res);
  }

  if (error.name === "AppError") {
    return handleAppError(error, res);
  }

  res.status(INTERNAL_SERVER_ERROR).json({ error: "something went wrong" });
};

export default errorHandler;
