import { Router } from "express";
import {
  loginHandler,
  registerHandler,
  logoutHandler,
  refreshTokenHandler,
} from "../controllers/auth.controllers";

const authRoutes = Router();

// register route
authRoutes.post("/register", registerHandler);

// login route
authRoutes.post("/login", loginHandler);

// logout route
authRoutes.get("/logout", logoutHandler);

// refresh token route
authRoutes.get("/refresh", refreshTokenHandler);

export default authRoutes;
