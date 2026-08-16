import React from "react";
import { BentoItem, Button, Skeleton, PlansIllustration } from "@/components";
import { FaProjectDiagram } from "react-icons/fa";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/siteConfig";

const PlansPreview = ({ className }) => {
  const loading = usePortfolioStore((state) => state.loading);
  const plansConfig = siteConfig?.pages?.home?.universe?.plans;

  if (loading) {
    return (
      <BentoItem className={cn(className)}>
        <Skeleton className="w-full h-full min-h-24" />
      </BentoItem>
    );
  }

  return (
    <BentoItem
      className={cn(className)}
      title={plansConfig?.title}
      description={plansConfig?.description}
      header={<PlansIllustration />}
      icon={<FaProjectDiagram className="h-12 w-12 text-muted-foreground" />}
    >
      <Button to="/services" variant="secondary" className="w-full mt-4">
        {plansConfig?.button}
      </Button>
    </BentoItem>
  );
};

export default PlansPreview;
