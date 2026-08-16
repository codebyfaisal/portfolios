import mongoose, { Schema } from "mongoose";

const subscriberSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        isSubscribed: {
            type: Boolean,
            default: true,
        },
        likedPosts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post"
            }
        ]
    },
    { timestamps: true }
);

export const Subscriber = mongoose.model("Subscriber", subscriberSchema);
