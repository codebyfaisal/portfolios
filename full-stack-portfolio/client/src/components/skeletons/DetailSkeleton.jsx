import React from "react";
import { Skeleton } from "@/components";

const DetailSkeleton = () => {
  return (
    <div className="min-h-screen space-y-8">
      {/* Back Link */}
      <Skeleton className="h-6 w-32" />

      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-2/3 md:w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
