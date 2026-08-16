import React from "react";
import { FaMoon, FaSun, FaDesktop } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`flex items-center gap-1 p-1 bg-secondary/60 rounded-xl border border-border/50 ${className}`}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
          theme === "light"
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Light Mode"
        aria-label="Light Mode"
      >
        <FaSun size={14} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
          theme === "dark"
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Dark Mode"
        aria-label="Dark Mode"
      >
        <FaMoon size={14} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
          theme === "system"
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="System Preference"
        aria-label="System Preference"
      >
        <FaDesktop size={14} />
      </button>
    </div>
  );
};

export default ThemeToggle;
