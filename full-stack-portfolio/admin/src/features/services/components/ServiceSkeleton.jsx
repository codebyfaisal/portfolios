import React from "react";
import { Card, Skeleton } from "@/components";

const ServiceSkeleton = () => {
  return [1, 2, 3, 4, 5, 6].map((i) => (
    <Card key={i} className="overflow-hidden" padding="">
      <div className="flex flex-col items-center gap-4 text-center flex-1 p-4">
        {/* Icon Skeleton */}
        <Skeleton className="w-16 h-16 rounded-xl" />

        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4 mt-2" />

        {/* Description Skeleton */}
        <div className="space-y-2 w-full flex flex-col justify-center items-center">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
          <Skeleton className="h-3 w-3/6" />
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex justify-center gap-4 bg-muted/50 w-full p-4">
        <div className="flex gap-1">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  ));
};

export default ServiceSkeleton;
