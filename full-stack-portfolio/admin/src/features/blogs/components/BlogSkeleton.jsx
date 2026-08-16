import React from "react";
import { Skeleton } from "@/components";

const BlogSkeleton = () => {
  return [1, 2, 3, 4, 5].map((i) => (
    <div
      key={i}
      className="grid grid-cols-[1fr_100px_120px_120px] gap-4 px-6 py-4 items-center border-b border-border last:border-0"
    >
      {/* Title */}
      <Skeleton className="h-5 w-3/4" />

      {/* Views */}
      <Skeleton className="h-4 w-12" />

      {/* Created */}
      <Skeleton className="h-4 w-24" />

      {/* Actions - Fixed */}
      <div className="flex justify-end gap-2">
        <Skeleton className="size-6 rounded-lg" />
        <Skeleton className="size-6 rounded-lg" />
        <Skeleton className="size-6 rounded-lg" />
      </div>
    </div>
  ));
};

export default BlogSkeleton;
