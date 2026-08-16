import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "@/api/axios";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import { NotFound, Skeleton, SEO } from "@/components";
import LikeButton from "./components/LikeButton";
import { FaArrowLeft, FaCalendar, FaEye, FaHashtag } from "react-icons/fa";

const SkeletonLoader = () => {
  return (
    <>
      {/* Back Button */}
      <Skeleton className="w-32 h-6 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-14">
        {/* Left Content Column */}
        <div className="lg:col-span-3 space-y-8">
          {/* Title */}
          <Skeleton className="h-12 w-3/4" />

          {/* Cover Image */}
          <Skeleton className="aspect-video w-full" />

          {/* Article Content */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-32 w-fullmt-4" />
            {/* Code block sim */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-4 w-24 mb-3" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <div className="w-full h-px bg-border"></div>

              <div>
                <Skeleton className="h-4 w-16 mb-3" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              <div className="w-full h-px bg-border"></div>

              <div>
                <Skeleton className="h-4 w-16 mb-3" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-border"></div>

              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const { rounded, isRounded } = usePortfolioStore();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/public/${slug}`);
        setPost(response.data.data);
      } catch (error) {
        console.error("Failed to fetch post", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    const timer = setTimeout(() => {
      const preTags = document.querySelectorAll("#blog-content pre");

      preTags.forEach((pre) => {
        if (pre.querySelector(".copy-btn")) return;

        pre.style.position = "relative";

        const button = document.createElement("button");
        button.title = "Copy Code";

        pre.classList.add("group");
        button.className =
          "copy-btn absolute top-2 right-2 bg-card/80 hover:bg-card text-muted-foreground hover:text-foreground p-1.5 transition-all border border-border/50 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200" +
          rounded;

        button.innerHTML =
          '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

        button.addEventListener("click", async () => {
          const code = pre.querySelector("code")?.innerText || pre.innerText;
          try {
            await navigator.clipboard.writeText(code);

            button.innerHTML =
              '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="16" width="16" class="text-green-500" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>';

            setTimeout(() => {
              button.innerHTML =
                '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            }, 2000);
          } catch (err) {
            console.error("Failed to copy", err);
          }
        });

        pre.appendChild(button);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [post]);

  return (
    <>
      <SEO
        title={post?.title}
        description={post?.excerpt}
        keywords={post?.tags}
        image={post?.coverImage}
      />

      {loading ? (
        <SkeletonLoader />
      ) : error || !post ? (
        <NotFound
          title="Article Not Found"
          description="The article you are looking for does not exist or has been moved."
          link="/blogs"
          backTo="Back to Blogs"
          backgroundText="EMPTY"
          showBackgroundBubbles={false}
          className="my-10"
          rounded={rounded}
        />
      ) : (
        <>
          {/* Back Button */}
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            title="Back to Blogs"
          >
            <FaArrowLeft /> Back to Blogs
          </Link>

          {rounded && (
            <style>
              {`pre {
                border-radius: 0.5rem;
              }`}
            </style>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-14">
            {/* Left Content Column */}
            <article className="lg:col-span-3 space-y-8">
              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>

              {/* Cover Image */}
              {post.coverImage && (
                <div
                  className={cn(
                    "aspect-video w-full overflow-hidden border border-border",
                    rounded,
                  )}
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Article Content */}
              <div
                className={cn(
                  "prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 overflow-hidden",
                  isRounded && "prose-img:rounded-3xl",
                )}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                id="blog-content"
              />
            </article>

            {/* Right Sidebar Column */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Meta Card */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium mb-3 uppercase tracking-wider">
                      Published On
                    </h3>
                    <div className="flex items-center gap-2 text-foreground">
                      <FaCalendar className="text-secondary" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border"></div>

                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium mb-3 uppercase tracking-wider">
                      Views
                    </h3>
                    <div className="flex items-center gap-2 text-foreground">
                      <FaEye className="text-secondary" />
                      <span>{post.views} read</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border"></div>

                  <div className="flex justify-center">
                    <LikeButton
                      postId={post._id}
                      initialLikesCount={post.likesCount || 0}
                    />
                  </div>

                  <div className="w-full h-px bg-border"></div>

                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium mb-3 uppercase tracking-wider">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            "px-3 py-1 bg-card border border-border text-xs text-muted-foreground flex items-center gap-1",
                            rounded,
                          )}
                        >
                          <FaHashtag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-px bg-border"></div>

                  <Link
                    to="/blogs"
                    className={cn(
                      "inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors bg-card border border-border px-4 py-2 w-full justify-center",
                      rounded,
                    )}
                  >
                    <FaArrowLeft /> Back to Blogs
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </>
  );
};

export default BlogPost;
