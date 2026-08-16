import React, { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";

const Textarea = forwardRef(
  ({ className, wrapperClassName, label, error, children, ...props }, ref) => {
    const { isRounded } = usePortfolioStore();
    const id = useId();
    const inputId = props.id || id;

    return (
      <div className={cn("space-y-2 w-full", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[0.9rem] font-medium text-muted-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-card border border-border px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed resize-none",
            error && "border-red-500",
            isRounded && "rounded-2xl",
            className
          )}
          {...props}
        />
        {error && typeof error === "string" && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        {children}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
