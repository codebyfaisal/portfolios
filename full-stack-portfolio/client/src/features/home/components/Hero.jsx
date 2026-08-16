import React, { useState } from "react";
import {
  FaPlayCircle,
  FaFileDownload,
  FaLightbulb,
  FaBrain,
  FaLinkedin,
  FaLaptop,
  FaGlobe,
  FaCloud,
  FaServer,
} from "react-icons/fa";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";
import { optimizeImage } from "@/utils/imageOptimizer";
import { Button, SocialIcons, VideoModal, Skeleton } from "@/components";
import { useTheme } from "@/context/ThemeContext";

const borderRadius = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "50% 50% 40% 60% / 60% 40% 60% 40%",
  "42% 58% 45% 55% / 53% 28% 72% 47%",
  "52% 48% 55% 45% / 47% 74% 26% 53%",
  "52% 48% 55% 45% / 47% 40% 60% 53%",
  "60% 40% 30% 70% / 60% 30% 70% 40%",
];

const Hero = ({ heroConfig }) => {
  const { rounded, config, user, loading } = usePortfolioStore();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { theme } = useTheme();

  const randomBorderRadius = Math.floor(Math.random() * borderRadius.length);

  if (loading) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <Skeleton className="w-32 h-8 mb-6" />
            <Skeleton className="w-full max-w-lg h-24 mb-6" />
            <Skeleton className="w-full max-w-md h-16 mb-8" />
            <div className="flex gap-4 mb-12">
              <Skeleton className="w-32 h-12" />
              <Skeleton className="w-32 h-12" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Skeleton className="w-full max-w-md aspect-square opacity-20" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-9 relative overflow-hidden">
      {/* Background Elements */}
      <div
        className={cn(
          "absolute top-1/4 -left-20 w-72 h-72 bg-secondary/20 blur-[60px] transition-all duration-700 ease-in-out",
          rounded,
        )}
      />
      <div
        className={cn(
          "absolute bottom-1/4 -right-20 w-72 h-72 bg-accent/20 blur-[60px] transition-all duration-700 ease-in-out",
          rounded,
        )}
      />

      <div
        className={cn(
          "absolute inset-0 overflow-hidden pointer-events-none select-none",
          theme === "light" ? "opacity-30" : "opacity-10",
        )}
        aria-hidden="true"
      >
        <FaServer className="absolute top-20 left-50 text-4xl text-primary animate-float-slow" />
        <FaLaptop className="absolute bottom-32 right-13 text-4xl text-secondary animate-float-medium" />
        <FaGlobe className="absolute top-32 right-20 text-4xl text-green-500 animate-pulse" />
        <FaBrain className="absolute bottom-1/2 left-1/2 text-4xl text-pink-400 animate-pulse" />
        <FaCloud className="absolute top-1/2 left-10 text-4xl text-blue-400 animate-float-slow" />
        <FaLightbulb className="absolute top-10 left-1/2 text-4xl text-yellow-500 animate-bounce" />
        <FaLinkedin className="absolute bottom-1/4 left-1/3 text-4xl text-blue-500 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-12 items-center relative z-10">
        <div className="animate-fade-in-left">
          <p
            className={cn(
              "inline-block px-4 py-2 bg-card border border-border transition-colors duration-300 text-foreground font-medium",
              rounded,
            )}
          >
            {config?.hero?.greeting || heroConfig?.greeting}
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-20 transition-colors duration-300">
            <span className="text-transparent bg-clip-text bg-linear-to-l from-foreground to-muted-foreground">
              {config?.hero?.title || heroConfig.title}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed max-w-lg transition-colors duration-300">
            {config?.hero?.subTitle || config?.user?.bio || heroConfig.subTitle}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Button to="/contact" variant="primary" size="lg">
              Let's Talk
            </Button>

            {user?.resume && (
              <Button
                href={user?.resume}
                variant="secondary"
                size="lg"
                icon={FaFileDownload}
              >
                {heroConfig?.buttons?.resume || "Resume"}
              </Button>
            )}
            {user?.introVideo && (
              <Button
                onClick={() => setIsVideoOpen(true)}
                variant="secondary"
                size="lg"
                icon={FaPlayCircle}
              >
                {heroConfig?.buttons?.video || "Intro"}
              </Button>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <span className="w-16 h-px transition-colors duration-300 bg-linear-to-r from-primary/5 via-primary to-secondary animate-pulse"></span>

            <div className="flex gap-6">
              {user?.socialLinks &&
                Object.entries(user?.socialLinks || {}).map(([social, url]) => (
                  <SocialIcons key={social} social={social} url={url} />
                ))}
            </div>
          </div>
        </div>

        <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in-scale">
          <div
            className="relative z-10 w-full max-w-sm aspect-square overflow-hidden border border-border bg-card transition-all duration-500 linear"
            style={{
              borderRadius: borderRadius[randomBorderRadius],
            }}
          >
            {config?.hero?.image || user?.avatar ? (
              <img
                src={
                  optimizeImage(
                    (config?.hero?.image || user?.avatar || "").replace(
                      /^http:\/\//,
                      "https://",
                    ),
                    { width: 800 },
                  ) || null
                }
                alt={config?.hero?.title || user?.name?.first || "Hero Image"}
                className="w-full h-full object-cover"
                width={400}
                height={400}
                fetchPriority="high"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          {/* Decorative circles */}
          <div
            className="absolute -z-10 w-2/4 aspect-square scale-180 border border-border top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
            style={{
              borderRadius: borderRadius[randomBorderRadius],
            }}
          />
          <div
            className="absolute -z-10 w-3/4 aspect-square scale-150 border border-border top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
            style={{
              borderRadius: borderRadius[randomBorderRadius],
            }}
          />
        </div>
      </div>

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        video={user?.introVideo}
      />
    </section>
  );
};

export default React.memo(Hero);
