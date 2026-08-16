import mongoose, { Schema } from "mongoose";

const formSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        job: {
            type: Schema.Types.ObjectId,
            ref: "Job",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiryDate: {
            type: Date,
        },
        questions: [
            {
                id: { type: String, required: true },
                type: {
                    type: String,
                    required: true,
                    enum: ["text", "textarea", "number", "select", "date"],
                },
                label: { type: String, required: true },
                required: { type: Boolean, default: false },
                options: [{ type: String }],
                placeholder: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Form = mongoose.model("Form", formSchema);
