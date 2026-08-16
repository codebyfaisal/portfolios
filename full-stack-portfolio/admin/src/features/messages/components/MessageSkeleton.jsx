import React from "react";
import { Skeleton } from "@/components";

const MessageSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="grid grid-cols-[100px_120px_1.5fr_2fr_120px_140px] gap-4 px-6 py-4 items-center border-b border-border last:border-0"
        >
          {/* Status */}
          <Skeleton className="h-6 w-20 rounded-full" />

          {/* Type */}
          <Skeleton className="h-6 w-20 rounded-full" />

          {/* From */}
          <Skeleton className="h-4 w-3/4" />

          {/* Subject */}
          <Skeleton className="h-4 w-full" />

          {/* Date */}
          <Skeleton className="h-4 w-20" />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Skeleton className="h-6 w-8 rounded-md" />
            <Skeleton className="h-6 w-8 rounded-md" />
            <Skeleton className="h-6 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
};

export default MessageSkeleton;
