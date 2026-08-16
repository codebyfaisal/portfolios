import React from "react";
import { FaCode } from "react-icons/fa";
import { Skeleton, BentoItem, TechStackIllustration } from "@/components";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/siteConfig";

const TechStackPreview = ({ className }) => {
  const loading = usePortfolioStore((state) => state.loading);

  if (loading) {
    return (
      <BentoItem
        className={cn(className)}
        header={<Skeleton className="w-full h-full min-h-24" />}
      />
    );
  }

  return (
    <BentoItem
      className={cn(className)}
      title={siteConfig?.pages?.home?.universe?.techStack?.title}
      description={siteConfig?.pages?.home?.universe?.techStack?.description}
      header={<TechStackIllustration />}
      icon={<FaCode className="h-10 w-10 text-muted-foreground" />}
    />
  );
};

export default TechStackPreview;
