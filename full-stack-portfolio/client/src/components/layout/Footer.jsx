import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { Button, SocialIcons } from "@/components";
import { siteConfig } from "@/config/siteConfig";
import usePortfolioStore from "@/store/usePortfolioStore";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/cn";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user, config } = usePortfolioStore();
  const { theme } = useTheme();

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[90%] h-96 bg-primary/5 rounded-2xl blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[90%] h-96 bg-secondary/5 rounded-2xl blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Main CTA Section */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-b from-foreground to-foreground/50 bg-clip-text text-transparent py-3">
            {config?.footer?.title || "Ready to build something amazing?"}
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            {config?.footer?.description || "Let's turn your ideas into reality. Whether you need a stunning website, a complex web application, or expert consultation, I'm here to help."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              to="/contact"
              size="lg"
              className="px-8 min-w-40"
              title="Contact Me"
            >
              Start a Project
            </Button>
            <Button
              to="/services"
              variant="secondary"
              size="lg"
              className="px-8 min-w-40"
              title="View Services"
            >
              View Services
            </Button>
          </div>

          <div className="flex gap-4 mt-10">
            {user?.socialLinks &&
              Object.entries(user?.socialLinks || {}).map(([social, url]) => (
                <SocialIcons key={social} social={social} url={url} />
              ))}
          </div>
        </div>

        {/* Separator */}
        <div
          className={cn(
            "h-px w-full bg-linear-to-r from-transparent to-transparent my-8",
            theme === "light" ? "via-black/20" : "via-border",
          )}
        />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              &copy; {currentYear} {siteConfig.navigation.brandFallback}. All
              rights reserved.
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link
              to="/track-application"
              className="hover:text-foreground transition-colors flex items-center gap-2"
              title="Track your application status"
            >
              Track Application
            </Link>

            <div className="flex items-center gap-2">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>by Faisal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
