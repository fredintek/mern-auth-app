import { CookieOptions, Response } from "express";
import { fifteenMinuitesFromNow, thirtyDaysFromNow } from "./date";

export const REFRESH_COOKIE_PATH = "/auth/refresh";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinuitesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: "/auth/refresh",
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res: Response) => {
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken", { path: REFRESH_COOKIE_PATH });
};
