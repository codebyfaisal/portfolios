import React from "react";
import { BentoItem, Skeleton } from "@/components";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";
import { FaBriefcase } from "react-icons/fa";
import { siteConfig } from "@/config/siteConfig";

const ExperiencePreview = ({ className }) => {
  const { user, loading, rounded } = usePortfolioStore((state) => state);
  const experience = user?.experience || [];
  const expConfig = siteConfig?.pages?.home?.universe?.experience;

  if (loading) {
    return (
      <BentoItem className={cn(className)}>
        <Skeleton className="w-full h-full min-h-24" />
      </BentoItem>
    );
  }

  const latestRole = experience[0];

  return (
    <BentoItem
      className={cn("relative overflow-hidden group", className)}
      header={
        <>
          <div className="absolute top-6 right-4 text-orange-500/20 group-hover:text-orange-500 transition-colors">
            <FaBriefcase size={20} />
          </div>

          <div className="h-full flex flex-col justify-between z-10 py-0">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-foreground mb-1">
                {expConfig?.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {expConfig?.description}
              </p>
            </div>

            {latestRole ? (
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "w-2 h-2 bg-orange-500 animate-pulse",
                      rounded,
                    )}
                  ></span>
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                    {latestRole.current
                      ? expConfig?.currentRoleTag
                      : expConfig?.latestRoleTag}
                  </p>
                </div>
                <h3 className="text-sm font-bold text-foreground leading-tight">
                  {latestRole.role}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {expConfig?.at}{" "}
                  <span className="text-foreground">
                    {latestRole.company}{latestRole.location ? `, ${latestRole.location}` : ""}
                  </span>
                </p>
              </div>
            ) : (
              <div className="mt-auto">
                <p className="text-xs text-muted-foreground">
                  {expConfig?.noExperience}
                </p>
              </div>
            )}
          </div>
        </>
      }
    />
  );
};

export default ExperiencePreview;
