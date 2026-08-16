import React from "react";
import { Skeleton } from "@/components";

const UserPersonalDetailsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <div className="space-y-1" key={index}>
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-12" />
      </div>
    ))}
    <div className="space-y-1 col-span-2">
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-44" />
    </div>
  </div>
);

export default UserPersonalDetailsSkeleton;
