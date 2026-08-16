import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    images: {
        type: [String],
        required: [true, "Image is required"]
    },
    date: {
        start: {
            type: Date,
            required: [true, "Start date is required"]
        },
        ongoing: {
            type: Boolean,
            default: false
        },
        end: {
            type: Date,
            required: [
                function () {
                    return !this.date.ongoing;
                },
                "End date is required",
            ],
        }
    },
    featured: {
        type: Boolean,
        default: false
    },
    techStack: [String],
    liveLink: {
        type: String
    },
    features: [String],
    githubLink: {
        type: String
    }
}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);
