import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { PostService } from "./post.service.js";

const getPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};
    if (search) {
        query.title = { $regex: search, $options: "i" };
    }
    if (status) {
        query.isPublished = status === "published";
    }

    const { posts, total } = await PostService.getPosts(query, page, limit);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                posts,
                meta: {
                    total,
                    page: Number(page),
                    totalPages: Math.ceil(total / limit),
                },
            },
            "Posts fetched successfully"
        )
    );
});

const getPublicPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 6 } = req.query;
    const posts = await PostService.getPublicPosts(page, limit);
    const total = await PostService.countPosts();

    res.status(200).json(
        new ApiResponse(200, { posts, hasMore: page * limit < total }, "Published posts fetched successfully")
    );
});

const getPostBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const post = await PostService.getPostBySlug(slug);

    res.status(200).json(new ApiResponse(200, post, "Post details fetched"));
});

const createPost = asyncHandler(async (req, res) => {
    const { title, content, excerpt, coverImage, tags } = req.body;

    if (!title || !content) {
        throw new ApiError(400, "Title and Content are required");
    }

    const post = await PostService.createPost({
        title,
        content,
        excerpt,
        coverImage,
        tags,
    });

    res
        .status(201)
        .json(new ApiResponse(201, post, "Post created successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, excerpt, coverImage, tags } = req.body;

    const post = await PostService.updatePost(id, { title, content, excerpt, coverImage, tags });

    res
        .status(200)
        .json(new ApiResponse(200, post, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await PostService.deletePost(id);

    res
        .status(200)
        .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const toggleLike = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) throw new ApiError(400, "Email is required to like a post");

    const result = await PostService.toggleLike(id, email);

    // Fetch updated subscriber to get full liked list for cookie
    const { Subscriber } = await import("../subscribers/subscriber.model.js");
    const subscriber = await Subscriber.findOne({ email });
    const likedPosts = subscriber ? subscriber.likedPosts : [];

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
    };

    res
        .status(200)
        .cookie("user_email", email, options)
        .cookie("user_liked_posts", JSON.stringify(likedPosts), options)
        .json(new ApiResponse(200, result, "Like updated"));
});

const getLikeStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let { email } = req.query;

    // Fallback to cookie if email not provided in query
    if (!email && req.cookies?.user_email) {
        email = req.cookies.user_email;
    }

    if (!email) return res.status(200).json(new ApiResponse(200, { liked: false }, "Status checked"));

    const isLiked = await PostService.checkLikeStatus(id, email);
    res.status(200).json(new ApiResponse(200, { liked: isLiked, email }, "Status checked"));
});

export {
    getPosts,
    getPublicPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    getLikeStatus
};
