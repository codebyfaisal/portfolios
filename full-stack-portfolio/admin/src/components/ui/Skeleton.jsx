import React from "react";
import { cn } from "@/utils/cn";

const Skeleton = ({ className, children }) => {
  return (
    <div className={cn("bg-muted rounded animate-pulse", className)}>
      {children}
    </div>
  );
};

export default Skeleton;
