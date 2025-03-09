import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import { AppErrorCode } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Missing or invalid access token",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken);

  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;

  next();
};

export default authenticate;
