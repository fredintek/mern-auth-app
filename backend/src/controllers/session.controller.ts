import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import SessionModel from "../models/session.model";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";

export const getSessionsHandler = catchErrors(async (req, res, next) => {
  const sessions = await SessionModel.find(
    // this first object is the find criteria
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },

    // this second object is the projection to only return the necessary fields
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },

    // this third object is the options for sorting and pagination more like options
    {
      sort: { createdAt: -1 },
    }
  );

  return res.status(OK).json(
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session._id === req.sessionId && { isCurrent: true }),
    }))
  );
});

export const deleteSessionsHandler = catchErrors(async (req, res, next) => {
  const sessionId = z.string().parse(req.params.sessionId);
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });

  appAssert(deleted, NOT_FOUND, "Session not found");
  return res.status(OK).json({
    message: "Session removed",
  });
});
