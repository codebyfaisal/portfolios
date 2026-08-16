import React from "react";
import { Skeleton } from "@/components";

const VisitorSkeleton = () => {
  return [1, 2, 3, 4, 5].map((i) => (
    <div key={i} className="grid grid-cols-12 gap-4 items-center py-2">
      <div className="col-span-1 flex items-center">
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <div className="col-span-2">
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="col-span-3">
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="col-span-3">
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="col-span-2">
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="col-span-1 flex justify-end">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  ));
};

export default VisitorSkeleton;
