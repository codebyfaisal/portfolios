import Post from "./post.model.js";
import { ApiError } from "../../utils/ApiError.js";

const getPosts = async (query = {}, page = 1, limit = 10) => {
    const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Post.countDocuments(query);

    return { posts, total };
};

const getPublicPosts = async (page = 1, limit = 10) => {
    const posts = await Post.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    return posts;
};

const getPostBySlug = async (slug) => {
    const post = await Post.findOne({ slug });
    if (!post) throw new ApiError(404, "Post not found");

    post.views += 1;
    await post.save({ validateBeforeSave: false });

    return post;
};

const createPost = async (data) => {
    return await Post.create(data);
};

const updatePost = async (id, data) => {
    const post = await Post.findById(id);
    if (!post) throw new ApiError(404, "Post not found");

    if (data.title) post.title = data.title;
    if (data.content) post.content = data.content;
    if (data.excerpt) post.excerpt = data.excerpt;
    if (data.coverImage) post.coverImage = data.coverImage;
    if (data.tags) post.tags = data.tags;

    await post.save();
    return post;
};

const deletePost = async (id) => {
    const post = await Post.findByIdAndDelete(id);
    if (!post) throw new ApiError(404, "Post not found");
    return post;
};

const countPosts = async () => {
    return await Post.countDocuments();
};

import { Subscriber } from "../subscribers/subscriber.model.js";

const toggleLike = async (postId, email) => {
    const post = await Post.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    let subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
        subscriber = await Subscriber.create({
            email,
            isSubscribed: true
        });
    }

    const hasLiked = subscriber.likedPosts.includes(postId);
    let isLiked = false;

    if (hasLiked) {
        // Unlike: Remove post from subscriber, Decrement post count
        subscriber.likedPosts = subscriber.likedPosts.filter(id => id.toString() !== postId);
        post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
        isLiked = false;
    } else {
        // Like: Add post to subscriber, Increment post count
        subscriber.likedPosts.push(postId);
        post.likesCount = (post.likesCount || 0) + 1;
        isLiked = true;
    }

    await subscriber.save();
    await post.save({ validateBeforeSave: false });

    return { liked: isLiked, likesCount: post.likesCount };
};

const checkLikeStatus = async (postId, email) => {
    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) return false;
    return subscriber.likedPosts.includes(postId);
};

export const PostService = {
    getPosts,
    getPublicPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    countPosts,
    toggleLike,
    checkLikeStatus
};
