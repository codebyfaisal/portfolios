import React from "react";
import { Skeleton, Card } from "@/components";

const FormSkeleton = () => {
  return [1, 2, 3, 4, 5, 6].map((i) => (
    <Card key={i} className="flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </Card>
  ));
};

export default FormSkeleton;
