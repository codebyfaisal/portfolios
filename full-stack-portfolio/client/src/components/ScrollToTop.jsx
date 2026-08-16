import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { rounded } = usePortfolioStore();
  const [show, setShow] = useState(false);

  const scrollTo = (behavior = "smooth") => {
    const container = document.getElementById("main-scroll-container");
    if (container) container.scrollTo({ top: 0, behavior });
  };

  useEffect(() => {
    const container = document.getElementById("main-scroll-container");
    const handleScroll = () => {
      if (container && container.scrollTop > 300) setShow(true);
      else setShow(false);
    };

    if (container) container.addEventListener("scroll", handleScroll);
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    scrollTo("auto");
  }, [pathname]);

  return (
    <button
      onClick={() => scrollTo()}
      className={cn(
        "fixed bottom-4 -right-10 z-50 p-2 bg-primary backdrop-blur-md hover:bg-primary/80 transition-all duration-300 animate-pulse",
        rounded,
        show && "right-4",
      )}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <FaArrowUp className="w-4 h-4 text-secondary" />
    </button>
  );
};

export default ScrollToTop;
