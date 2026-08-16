import React, { useEffect } from "react";
import { createPortal } from "react-dom";

import { FaTimes } from "react-icons/fa";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";

const getVideoEmbedDetails = (videoProp) => {
  if (!videoProp) return null;
  const rawUrl = (
    typeof videoProp === "string"
      ? videoProp
      : videoProp.url || videoProp.src || ""
  ).trim();

  if (!rawUrl) return null;

  if (rawUrl.startsWith("<iframe") || videoProp.type === "iframe") {
    return { type: "html", html: rawUrl };
  }

  // YouTube Watch / Shorts / Embed URL
  const ytMatch = rawUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^&?#/]+)/,
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "embed",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo URL: vimeo.com/VIDEO_ID
  const vimeoMatch = rawUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "embed",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // Direct video file or standard video URL
  return {
    type: "video",
    url: rawUrl,
  };
};

const VideoModal = ({ isOpen, onClose, video }) => {
  const { rounded } = usePortfolioStore();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  const embedDetails = getVideoEmbedDetails(video);

  if (!isOpen || !embedDetails) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-card/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effect */}
        <div
          className={cn(
            "absolute -inset-4 bg-linear-to-r from-secondary/50 to-primary/50 opacity-30 blur-2xl -z-10 transition-opacity duration-500",
            rounded,
          )}
        />

        {/* Gradient Border Wrapper */}
        <div
          className={cn(
            "relative w-full h-full p-px bg-linear-to-br from-foreground/20 via-foreground/5 to-foreground/10 overflow-hidden",
            rounded,
          )}
        >
          {/* Inner Container */}
          <div
            className={cn(
              "relative w-full h-full bg-card backdrop-blur-xl flex items-center justify-center overflow-hidden",
              rounded,
            )}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn(
                "absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-card border border-border hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500 text-foreground transition-all duration-300 backdrop-blur-md group cursor-pointer",
                rounded,
              )}
              aria-label="Close modal"
            >
              <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {embedDetails.type === "html" ? (
              <div
                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                dangerouslySetInnerHTML={{ __html: embedDetails.html }}
              />
            ) : embedDetails.type === "embed" ? (
              <iframe
                src={embedDetails.embedUrl}
                title="Video player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                src={embedDetails.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default VideoModal;
