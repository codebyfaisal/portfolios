import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
    {
        job: {
            type: Schema.Types.ObjectId,
            ref: "Job",
        },
        form: {
            type: Schema.Types.ObjectId,
            ref: "Form",
        },
        applicant: {
            type: Schema.Types.ObjectId,
            ref: "Applicant",
            required: true,
        },
        coverLetter: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
            default: "Pending",
        },
        answers: [
            {
                questionId: { type: String, required: true },
                answer: { type: Schema.Types.Mixed, required: true },
                label: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
);

applicationSchema.pre("validate", async function () {
    if (!this.job && !this.form) {
        throw new Error("Application must be linked to either a Job or a Form");
    }
});

export const Application = mongoose.model("Application", applicationSchema);
