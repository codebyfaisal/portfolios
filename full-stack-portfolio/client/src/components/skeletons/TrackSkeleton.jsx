import React from "react";
import { Skeleton } from "@/components";

const TrackSkeleton = () => {
  return (
    <div className="space-y-6 mt-8">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="border border-border bg-card/50 p-6"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-0.5 h-full" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-0.5 h-full" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-0.5 h-full" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="w-6 h-6" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackSkeleton;
