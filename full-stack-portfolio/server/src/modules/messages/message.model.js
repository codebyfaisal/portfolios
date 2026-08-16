import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    from: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    subject: {
        type: String,
        required: [true, "Subject is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    type: {
        type: String,
        default: 'General'
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
