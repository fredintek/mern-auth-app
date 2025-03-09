import mongoose from "mongoose";
import { UserDocument } from "./src/models/user.model";
import { SessionDocument } from "./src/models/session.model";

declare global {
  namespace Express {
    interface Request {
      userId: UserDocument["_id"] | undefined;
      sessionId: SessionDocument["_id"] | undefined;
    }
  }
}

export {};
