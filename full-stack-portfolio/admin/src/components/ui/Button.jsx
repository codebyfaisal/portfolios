import { cn } from "@/utils/cn";
import React from "react";
import { CgSpinner } from "react-icons/cg";

const simpleVariant =
  "bg-transparent hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground focus:ring-ring";

const   Button = ({
  label,
  onClick,
  type = "button",
  uiType = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon = null,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-pimary border-transparent",
    secondary:
      "bg-secondary hover=:bg-secondary/80 text-secondary-foreground ring-1 ring-secondary focus:ring-ring border-transparent",
    danger:
      "bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive border-transparent",
    text: simpleVariant,
    outline:
      "bg-transparent border-input text-muted-foreground hover:border-accent hover:text-foreground hover:bg-accent",
    action: simpleVariant,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[uiType],
        uiType === "action" ? "p-2" : sizes[size],
        className
      )}
      {...props}
    >
      {loading && <CgSpinner className="animate-spin text-lg" />}
      {!loading && icon && (
        <span className={cn(uiType === "action" ? "text-sm" : "text-lg")}>
          {icon}
        </span>
      )}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;
