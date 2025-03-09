import "dotenv/config";
import express from "express";
import { connectToDatabase } from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import catchErrors from "./utils/catchErrors";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.routes";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user.routes";
import sessionRoutes from "./routes/session.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.get(
  "/",
  catchErrors(async (req, res, next) => {
    res.status(OK).json({
      status: "success",
      message: "Welcome to the API",
    });
  })
);

app.use("/auth", authRoutes);

// protected routes
app.use("/user", authenticate, userRoutes);
app.use("/sessions", authenticate, sessionRoutes);

app.use(errorHandler);

app.listen(4004, async () => {
  try {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
    await connectToDatabase();
  } catch (error) {}
});
