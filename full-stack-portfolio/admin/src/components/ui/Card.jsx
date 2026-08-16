import React from "react";
import { cn } from "@/utils/cn";

const Card = ({
  children,
  className,
  rounded = "rounded-xl",
  padding = "p-6",
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-card border border-border",
        padding,
        rounded,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
