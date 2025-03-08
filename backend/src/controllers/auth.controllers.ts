import catchErrors from "../utils/catchErrors";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
} from "../services/auth.service";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { loginSchema, registerSchema } from "./auth.schemas";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";

export const registerHandler = catchErrors(async (req, res, next) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call service
  const { user, accessToken, refreshToken } = await createAccount(request);

  // set tokens in response
  return setAuthCookies({
    res,
    accessToken,
    refreshToken,
  })
    .status(CREATED)
    .json(user);
});

export const loginHandler = catchErrors(async (req, res, next) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call service
  const { accessToken, refreshToken, user } = await loginUser(request);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});

export const logoutHandler = catchErrors(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const { payload, error } = verifyToken(accessToken);

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  return clearAuthCookies(res).status(OK).json({
    message: "Logged out successfully",
  });
});

export const refreshTokenHandler = catchErrors(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  // call service
  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access token refreshed successfully",
    });
});
