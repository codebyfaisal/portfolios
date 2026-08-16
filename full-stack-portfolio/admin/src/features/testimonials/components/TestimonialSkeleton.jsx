import React from "react";
import { Card, Skeleton } from "@/components";
import { FaQuoteLeft } from "react-icons/fa";

const TestimonialSkeleton = () => {
  return [1, 2, 3, 4, 5, 6].map((i) => (
    <Card key={i} className="flex flex-col h-64">
      {/* Header: Avatar + Info */}
      <div className="flex items-center gap-4 mb-4 relative">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex flex-col gap-2 w-1/2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <FaQuoteLeft className="absolute top-0 right-0 text-border text-4xl animate-pulse" />
      </div>

      {/* Text Body */}
      <div className="space-y-2 mb-6 grow">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-border mt-auto">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </Card>
  ));
};

export default TestimonialSkeleton;
