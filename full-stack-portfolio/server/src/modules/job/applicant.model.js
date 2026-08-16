import mongoose, { Schema } from "mongoose";

const applicantSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        resumeLink: {
            type: String,
            trim: true,
        },
        portfolioLink: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Applicant = mongoose.model("Applicant", applicantSchema);
