import React from "react";
import { Skeleton, Card } from "@/components";

const JobSkeleton = () => {
  return [1, 2, 3, 4].map((i) => (
    <Card
      key={i}
      className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
    >
      <div className="flex-1 w-full space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-16 px-2 py-0.5 rounded-full" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </Card>
  ));
};

export default JobSkeleton;
