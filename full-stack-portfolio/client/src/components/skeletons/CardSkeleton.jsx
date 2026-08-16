import React from "react";
import { Skeleton } from "@/components";
import { cn } from "@/utils/cn";

const CardSkeleton = ({ count = 3, className }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-border bg-card flex flex-col overflow-hidden"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-6 flex-1 flex flex-col space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="mt-auto pt-4">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
