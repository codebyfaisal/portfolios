
import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        requirements: [
            {
                type: String,
                trim: true,
            },
        ],
        status: {
            type: String,
            enum: ["Open", "Closed"],
            default: "Open",
        },
        salary: {
            min: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
                required: true,
            },
            currency: {
                type: String,
                required: true,
            },
        },
        lastDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

jobSchema.virtual("form", {
    ref: "Form",
    localField: "_id",
    foreignField: "job",
    justOne: true,
});

export const Job = mongoose.model("Job", jobSchema);
