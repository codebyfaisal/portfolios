import mongoose, { Schema } from "mongoose";

const planSchema = new Schema({
    name: { type: String, required: [true, "Name is required"] },

    price: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, required: [true, "Currency is required"], default: "$" }
    },

    deliveryTime: {
        show: { type: Boolean, default: false },
        time: { type: Number },
        unit: { type: String, enum: ["Days", "Weeks", "Months"] }
    },

    revisions: {
        show: { type: Boolean, default: false },
        count: { type: Number },
    },

    features: {
        type: [String],
        required: [true, "Features are required"]
    },

    addOns: {
        show: { type: Boolean, default: false },
        options: { type: [String], default: [] }
    },

    popular: { type: Boolean, default: false },
    isCustom: { type: Boolean, default: false }
}, { timestamps: true })

export const Plan = mongoose.model("Plan", planSchema);
