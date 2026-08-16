import React from "react";
import { FaHome } from "react-icons/fa";
import { Button, SEO } from "@/components";
import { cn } from "@/utils/cn";

const NotFound = ({
  title = "Page Not Found",
  description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
  link = "/",
  icon = <FaHome />,
  backTo = "Back to Home",
  isFullPage = true,
  backgroundText = "404",
  className = "",
  showBackgroundBubbles = true,
  rounded = false,
}) => {
  return (
    <section
      className={cn(
        "flex items-center justify-center p-4 pb-8 overflow-hidden relative w-full min-h-[50vh] bg-card border border-border",
        className,
        rounded,
      )}
    >
      {isFullPage && <SEO title={title} description={description} />}

      {/* Background Elements */}
      {showBackgroundBubbles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className={cn(
              "absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[100px]",
              rounded,
            )}
          />
          <div
            className={cn(
              "absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 blur-[100px]",
              rounded,
            )}
          />
        </div>
      )}

      <div className="text-center relative z-10">
        <div className="relative">
          <h1 className="text-[100px] md:text-[200px] font-bold text-primary/10 leading-none select-none">
            {backgroundText}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl md:text-5xl font-extrabold text-primary max-w-lg px-4">
              {title}
            </div>
          </div>
        </div>

        <p className="text-foreground/90 text-base md:text-lg max-w-md mx-auto mb-8">
          {description}
        </p>

        {link && (
          <div className="transition-all duration-300">
            <Button
              to={link}
              variant="white"
              size="lg"
              className="gap-2"
              title={backTo}
            >
              {icon}
              <span className="translate-y-[3px]">{backTo}</span>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NotFound;
