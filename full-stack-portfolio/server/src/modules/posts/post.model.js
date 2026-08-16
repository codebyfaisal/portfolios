import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
    },
    excerpt: {
      type: String,
      trim: true,
      maxLength: 200,
    },
    coverImage: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

postSchema.pre("save", async function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
