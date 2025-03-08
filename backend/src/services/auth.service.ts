import jwt from "jsonwebtoken";
import VerificationCodeTypes from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import { refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  // verify existing user does not already exist
  const existingUser = await UserModel.exists({ email: data.email });

  appAssert(!existingUser, CONFLICT, "Email already exists");

  // create a new user
  const user = new UserModel({ email: data.email, password: data.password });
  await user.save();

  // create a verification code
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeTypes.EmailVerification,
    expiresAt: oneYearFromNow(),
  });
  // TODO:send a verification email

  // create a session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  // sign access token and refresh token
  const accessToken = signToken({ sessionId: session._id, userId: user._id });

  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );
  // return user and tokens
  return { user: user.omitPassword(), accessToken, refreshToken };
};

export type LoginAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginAccountParams) => {
  // get the user by email
  const user = await UserModel.findOne({ email });

  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  // verify that the password is correct
  const isPasswordValid = await user.comparePassword(password);

  appAssert(isPasswordValid, UNAUTHORIZED, "Invalid email or password");

  // create a session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent,
  });

  // sign access token and refresh token
  const accessToken = signToken({ sessionId: session._id, userId: user._id });

  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  return { user: user.omitPassword(), accessToken, refreshToken };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });

  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Invalid session"
  );

  // refresh the session if it expires in the next 24 hours
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id })
    : undefined;

  const accessToken = signToken({
    sessionId: session._id,
    userId: session.userId,
  });

  return { accessToken, newRefreshToken };
};
