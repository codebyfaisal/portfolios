import React from "react";
import { Card, Skeleton } from "@/components";

const ProjectSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden" padding="">
          {/* Image Skeleton */}
          <Skeleton className="h-48 w-full rounded-none" />

          <div className="p-5 space-y-4">
            {/* Title */}
            <Skeleton className="h-6 w-full" />

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Tech Stack */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-border flex gap-4 items-center">
              <div className="flex gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default ProjectSkeleton;
