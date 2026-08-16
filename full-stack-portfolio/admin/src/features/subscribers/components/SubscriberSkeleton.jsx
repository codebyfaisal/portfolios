import React from "react";
import { Skeleton } from "@/components";

const SubscriberSkeleton = () => {
  return [1, 2, 3, 4, 5].map((i) => (
    <div
      key={i}
      className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-6 py-4 items-center"
    >
      {/* Email Column */}
      <Skeleton className="h-6 w-48" />

      {/* Status Column */}
      <Skeleton className="h-6 w-24 rounded-full" />

      {/* Date Column */}
      <Skeleton className="h-6 w-24" />

      {/* Actions Column */}
      <div className="flex justify-end">
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
    </div>
  ));
};

export default SubscriberSkeleton;
