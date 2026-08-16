import React from "react";
import { cn } from "@/utils/cn";

const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-5 gap-4 max-w-7xl mx-auto md:auto-rows-[100px]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default BentoGrid;
