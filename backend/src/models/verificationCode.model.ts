import mongoose from "mongoose";
import VerificationCodeTypes from "../constants/verificationCodeTypes";

export interface VerificationCodeDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: VerificationCodeTypes;
  expiresAt: Date;
  createdAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>(
  "VerificationCode",
  verificationCodeSchema,
  "verification_codes"
);

export default VerificationCodeModel;
