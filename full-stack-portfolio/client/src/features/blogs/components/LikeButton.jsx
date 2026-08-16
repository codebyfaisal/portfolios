import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { cn } from "@/utils/cn";
import { Button, Input } from "@/components";
import usePortfolioStore from "@/store/usePortfolioStore";
import axios from "@/api/axios";
import toast from "react-hot-toast";

const LikeButton = ({ postId, initialLikesCount = 0 }) => {
  const { rounded } = usePortfolioStore();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikesCount(initialLikesCount);

    const storedEmail = localStorage.getItem("user_email");

    try {
      const likedPosts = JSON.parse(
        localStorage.getItem("user_liked_posts") || "[]",
      );
      if (likedPosts.includes(postId)) {
        setLiked(true);
      }
    } catch (e) {
      console.error("Error parsing liked posts", e);
    }

    if (storedEmail) {
      setEmail(storedEmail);
      checkLikeStatus(storedEmail);
    }
  }, [postId, initialLikesCount]);

  const checkLikeStatus = async (userEmail) => {
    try {
      const response = await axios.get(
        `/posts/${postId}/like-status?email=${userEmail}`,
      );
      const isLiked = response.data.data.liked;

      setLiked(isLiked);

      const likedPosts = JSON.parse(
        localStorage.getItem("user_liked_posts") || "[]",
      );
      if (isLiked) {
        if (!likedPosts.includes(postId)) {
          localStorage.setItem(
            "user_liked_posts",
            JSON.stringify([...likedPosts, postId]),
          );
        }
      } else {
        if (likedPosts.includes(postId)) {
          localStorage.setItem(
            "user_liked_posts",
            JSON.stringify(likedPosts.filter((id) => id !== postId)),
          );
        }
      }
    } catch (error) {
      console.error("Failed to check status", error);
    }
  };

  const handleLikeClick = async () => {
    let currentEmail = email || localStorage.getItem("user_email");

    if (!currentEmail) {
      setShowEmailModal(true);
      return;
    }
    await toggleLike(currentEmail);
  };

  const toggleLike = async (userEmail) => {
    setLoading(true);

    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const response = await axios.post(`/posts/${postId}/like`, {
        email: userEmail,
      });
      const { liked: isLiked, likesCount: newCount } = response.data.data;

      setLiked(isLiked);
      setLikesCount(newCount);
      toast.success(isLiked ? "Thanks for liking!" : "Like removed");

      const likedPosts = JSON.parse(
        localStorage.getItem("user_liked_posts") || "[]",
      );
      if (isLiked) {
        if (!likedPosts.includes(postId)) {
          localStorage.setItem(
            "user_liked_posts",
            JSON.stringify([...likedPosts, postId]),
          );
        }
      } else {
        localStorage.setItem(
          "user_liked_posts",
          JSON.stringify(likedPosts.filter((id) => id !== postId)),
        );
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Something went wrong");
      setLiked(previousLiked);
      setLikesCount(previousCount);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    localStorage.setItem("user_email", email);
    setShowEmailModal(false);
    toggleLike(email);
  };

  return (
    <>
      <button
        onClick={handleLikeClick}
        disabled={loading}
        className={cn(
          "flex items-center gap-2 px-4 py-2 border transition-all duration-300 group",
          liked
            ? "bg-red-500/10 border-red-500/50 text-red-500"
            : "bg-card border-border hover:border-red-500/50 hover:text-red-500 text-muted-foreground",
          rounded,
        )}
      >
        {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        <span className="font-medium">{likesCount} Likes</span>
      </button>

      {/* Simple Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-scale">
          <div
            className={cn(
              "bg-card border border-border p-6 w-full max-w-sm shadow-2xl relative",
              rounded,
            )}
          >
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2 text-foreground">
              One last step!
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Please enter your email to like this post. We use this to prevent
              spam.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : "Confirm & Like"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LikeButton;
