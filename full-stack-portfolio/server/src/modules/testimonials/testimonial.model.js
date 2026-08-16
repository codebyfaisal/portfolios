import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    role: {
        type: String,
        required: [true, "Role is required"]
    },
    text: {
        type: String,
        required: [true, "Text is required"]
    },
    avatar: {
        type: String
    },
    hasVideo: {
        type: Boolean,
        default: false
    },
    videoType: {
        type: String,
        enum: ['iframe', 'video'],
        default: 'iframe'
    },
    videoUrl: {
        type: String
    }
}, { timestamps: true });

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
