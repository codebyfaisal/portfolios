import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/cn";

const ThemeToggle = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        "p-1.5 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200 flex items-center justify-center cursor-pointer rounded-lg border-0 outline-none shadow-none",
        className,
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <FaSun className="text-amber-400 text-lg" />
      ) : (
        <FaMoon className="text-black text-lg" />
      )}
    </button>
  );
};

export default ThemeToggle;
