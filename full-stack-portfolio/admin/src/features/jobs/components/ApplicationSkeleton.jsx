import React from "react";
import { Skeleton } from "@/components";

const ApplicationSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="grid grid-cols-[1.5fr_1.2fr_120px_120px_140px_80px] gap-4 px-6 py-4 items-center border-b border-border last:border-0"
        >
          {/* Applicant Column */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>

          {/* Job Title Column */}
          <Skeleton className="h-5 w-3/4" />

          {/* Date Column */}
          <Skeleton className="h-4 w-24" />

          {/* Status Column */}
          <Skeleton className="h-5 w-24 rounded-full" />

          {/* Links Column */}
          <div className="flex gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-10" />
          </div>

          {/* Actions Column */}
          <div className="flex justify-end gap-2">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ApplicationSkeleton;
