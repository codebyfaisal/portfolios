import mongoose, { Schema } from "mongoose";

const loginLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      default: "127.0.0.1",
    },
    location: {
      type: String,
      default: "Localhost",
    },
    userAgent: {
      type: String,
      default: "Unknown",
    },
    device: {
      type: String,
      default: "Desktop",
    },
    loggedInAt: {
      type: Date,
      default: Date.now,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

loginLogSchema.index({ userId: 1, loggedInAt: -1 });

export const LoginLog = mongoose.model("LoginLog", loginLogSchema);
