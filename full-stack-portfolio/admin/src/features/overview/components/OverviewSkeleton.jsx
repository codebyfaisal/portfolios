import React from "react";
import { Card, Skeleton } from "@/components";

const OverviewSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="flex items-center justify-between">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="size-8" />
                </div>
                <Skeleton className="h-10 w-12 rounded-full" />
              </Card>
            ))}
          </div>

          {/* Profile Health */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full mb-6" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/5 mb-2" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="size-2 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Messages */}
          <div className="col-span-full space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-16 mr-4" />
            </div>

            <Card padding="p-2">
              <div className="divide-y divide-border">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                      <div className="space-y-2 w-full max-w-sm">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-24 justify-end">
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSkeleton;
