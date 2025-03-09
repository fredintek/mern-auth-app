import { Router } from "express";
import {
  deleteSessionsHandler,
  getSessionsHandler,
} from "../controllers/session.controller";

const sessionRoutes = Router();

// get all active sessions
sessionRoutes.get("/", getSessionsHandler);

// delete session
sessionRoutes.delete("/:sessionId", deleteSessionsHandler);

export default sessionRoutes;
