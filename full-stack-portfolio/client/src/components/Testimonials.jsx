import React, { useState, useEffect } from "react";
import {
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
} from "react-icons/fa";
import { VideoModal, PageHeader } from "@/components";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/siteConfig";

const Testimonials = () => {
  const { data, rounded } = usePortfolioStore();
  const testimonials = data?.testimonials || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setShowVideo(false);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setShowVideo(false);
  };

  useEffect(() => {
    if (!showVideo) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials.length, showVideo]);

  if (!testimonials || testimonials.length === 0) return null;

  const safeIndex = currentIndex >= testimonials.length ? 0 : currentIndex;
  const currentTestimonial = testimonials[safeIndex];

  return (
    <section>
      <div className="relative max-w-4xl mx-auto">
        <PageHeader
          title={siteConfig?.testimonials?.title}
          description={siteConfig?.testimonials?.description}
          headingLevel="h2"
        />

        <div
          className={cn(
            "bg-card border border-border backdrop-blur-sm p-8 md:p-10 relative min-h-[250px]",
            rounded,
          )}
        >
          {/* Top Right Navigation */}
          {testimonials.length > 1 && (
            <div className="absolute top-6 right-6 flex gap-2 z-20">
              {[
                {
                  onclick: prevSlide,
                  label: "Previous",
                  Icon: FaChevronLeft,
                },
                {
                  onclick: nextSlide,
                  label: "Next",
                  Icon: FaChevronRight,
                },
              ].map(({ onclick, label, Icon }) => (
                <button
                  key={label}
                  onClick={onclick}
                  className={cn(
                    "p-2 text-foreground border border-border hover:bg-secondary/50 transition duration-300",
                    rounded,
                  )}
                  aria-label={label}
                >
                  <Icon size={12} />
                </button>
              ))}
            </div>
          )}

          <div className="relative min-h-[inherit]">
            <div
              key={safeIndex}
              className="flex flex-col md:flex-row gap-8 items-center md:items-start text-left animate-fade-in"
            >
              {/* Left: Profile & Actions */}
              <div className="flex flex-col items-center md:items-start shrink-0 md:w-48">
                <div
                  className={cn(
                    "w-20 h-20 border-2 border-secondary/50 p-1 mb-4",
                    rounded,
                  )}
                >
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    className={cn("w-full h-full object-cover", rounded)}
                  />
                </div>
                <div className="text-center md:text-left capitalize">
                  <h4 className="text-lg font-bold text-foreground">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-secondary text-sm mb-3">
                    {currentTestimonial.role}
                  </p>
                </div>

                <button
                  onClick={() => setShowVideo(true)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary/20 text-xs font-medium transition-colors text-foreground border border-border",
                    !currentTestimonial.hasVideo && "opacity-0",
                    rounded,
                  )}
                  aria-label="Watch video"
                  disabled={!currentTestimonial.hasVideo}
                >
                  <FaPlay className="text-[10px]" /> Watch Video
                </button>
              </div>

              {/* Right: Quote */}
              <div className="relative flex-1 flex flex-col justify-center pt-8 md:pt-0">
                <FaQuoteLeft className="text-3xl text-secondary/60 mb-4" />
                <p className="text-lg md:text-2xl text-foreground italic leading-relaxed min-h-[120px] flex items-center">
                  "{currentTestimonial.text}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 transition-all duration-300",
                index === currentIndex
                  ? "bg-secondary w-6"
                  : "bg-primary hover:bg-primary/50",
                rounded,
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Video Modal Component */}
      <VideoModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        video={{
          url: currentTestimonial.videoUrl,
          type: currentTestimonial.videoType,
        }}
      />
    </section>
  );
};

export default Testimonials;
