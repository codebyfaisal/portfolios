import mongoose, { Schema } from "mongoose";
import { commonStr, commonNum } from "../common/common.model.js";

const experienceSchema = new Schema({
    company: { ...commonStr, required: true },
    role: { ...commonStr, required: true },
    location: { ...commonStr },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false }
});

const educationSchema = new Schema({
    institution: { ...commonStr, required: true },
    location: { ...commonStr, required: true },
    degree: { ...commonStr, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false }
});

const userSchema = new Schema({
    avatar: {
        ...commonStr,
        default: ""
    },
    username: {
        ...commonStr,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        first: {
            ...commonStr,
            required: true
        },
        last: {
            ...commonStr
        }
    },
    email: {
        ...commonStr,
        required: true,
        unique: true,
        lowercase: true,
    },
    bio: {
        ...commonStr
    },
    phone: {
        ...commonStr
    },
    address: {
        ...commonStr
    },
    socialLinks: {
        website: { ...commonStr },
        github: { ...commonStr },
        linkedin: { ...commonStr },
        twitter: { ...commonStr },
        instagram: { ...commonStr },
        facebook: { ...commonStr },
        behance: { ...commonStr },
        dribbble: { ...commonStr },
        medium: { ...commonStr },
        youtube: { ...commonStr }
    },
    skills: [{
        name: { ...commonStr, required: true },
        icon: { ...commonStr },
        level: { ...commonNum },
        isTechStack: { type: Boolean, default: false }
    }],
    education: {
        type: [educationSchema],
        default: []
    },
    experience: {
        type: [experienceSchema],
        default: []
    },
    stats: {
        yearOfExperience: { ...commonNum },
        projectsCompleted: { ...commonNum },
        happyClients: { ...commonNum },
    },
    resume: {
        ...commonStr,
        default: ""
    },
    introVideo: {
        ...commonStr,
        default: ""
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
