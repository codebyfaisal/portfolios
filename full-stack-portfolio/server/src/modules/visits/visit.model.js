import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
    },
    page: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "60d",
    },
    location: {
      country: String,
      city: String,
      region: String,
    },
  },
  { timestamps: true }
);

export const Visit = mongoose.model("Visit", visitSchema);
