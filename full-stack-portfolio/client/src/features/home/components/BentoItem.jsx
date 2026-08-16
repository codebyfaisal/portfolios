import React from "react";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";

const BentoItem = ({
  className,
  title,
  description,
  header,
  icon,
  children,
}) => {
  const rounded = usePortfolioStore((state) => state.rounded);
  return (
    <article
      className={cn(
        "group relative p-4 overflow-hidden bg-card border border-border flex flex-col justify-between transition-all hover:border-secondary/20 hover:shadow-2xl hover:shadow-secondary/5",
        rounded,
        className
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-background/5 to-transparent opacity-0 group-hover/bento:opacity-100 transition-all" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="overflow-hidden">{header}</div>

        <div className="mt-3 transition-all space-y-2">
          {icon}
          <div className="font-sans font-bold text-foreground mb-2">
            {title}
          </div>
          <div className="font-sans font-normal text-muted-foreground text-sm leading-relaxed">
            {description}
          </div>
          {children}
        </div>
      </div>
    </article>
  );
};

export default React.memo(BentoItem);
