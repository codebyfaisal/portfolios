import mongoose, { Schema } from "mongoose";
import { commonStr } from "../common/common.model.js";

const serviceSchema = new Schema({
    title: {
        ...commonStr,
        required: [true, "Title is required"]
    },
    description: {
        ...commonStr,
        required: [true, "Description is required"]
    },
    icon: {
        ...commonStr,
    },
    features: [{
        ...commonStr,
    }],
    whyChooseMe: [{
        title: { ...commonStr, required: [true, "Why Choose Me title is required"] },
        description: { ...commonStr, required: [true, "Why Choose Me description is required"] },
        icon: { ...commonStr }
    }],
    techStack: [{
        name: { ...commonStr, required: [true, "Tech Stack name is required"] },
        icon: { ...commonStr }
    }],
    process: [{
        title: { ...commonStr, required: [true, "Process title is required"] },
        description: { ...commonStr, required: [true, "Process description is required"] }
    }],
    faq: [{
        question: { ...commonStr, required: [true, "FAQ question is required"] },
        answer: { ...commonStr, required: [true, "FAQ answer is required"] }
    }],
    cta: {
        ...commonStr,
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Service = mongoose.model("Service", serviceSchema);
