import { Router } from "express";
import {
  loginHandler,
  registerHandler,
  logoutHandler,
  refreshTokenHandler,
  verifyEmailHandler,
  sendpasswordResetHandler,
  resetPasswordHandler,
} from "../controllers/auth.controller";

const authRoutes = Router();

// register route
authRoutes.post("/register", registerHandler);

// login route
authRoutes.post("/login", loginHandler);

// logout route
authRoutes.get("/logout", logoutHandler);

// refresh token route
authRoutes.get("/refresh", refreshTokenHandler);

// refresh token route
authRoutes.get("/email/verify/:code", verifyEmailHandler);

// refresh token route
authRoutes.post("/password/forgot", sendpasswordResetHandler);

// reset password route
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
