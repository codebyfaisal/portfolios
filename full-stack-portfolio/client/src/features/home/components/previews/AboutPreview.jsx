import React from "react";
import { Button, Skeleton, AboutIllustration, BentoItem } from "@/components";
import { FaUser } from "react-icons/fa";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";
import { siteConfig } from "@/config/siteConfig";

const AboutPreview = ({ className }) => {
  const { data, rounded, loading } = usePortfolioStore();

  if (loading) {
    return (
      <BentoItem
        className={cn("md:col-span-2 md:row-span-1", className)}
        header={<Skeleton className="w-full h-full min-h-24" />}
        title={<Skeleton className="h-6 w-32" />}
        description={<Skeleton className="h-4 w-48 mt-2" />}
      >
        <div className="flex mt-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="flex-1 h-24 opacity-50" />
          ))}
        </div>
      </BentoItem>
    );
  }

  const config = data?.config || {};
  const user = data?.user || {};

  const aboutConfig = siteConfig?.pages?.home?.universe?.about;
  const description =
    config.about?.description || user.bio || aboutConfig?.description;

  const statsObj = user.stats || {};
  const stats = [
    { value: statsObj.yearOfExperience || 0, label: aboutConfig?.stats?.years },
    {
      value: statsObj.projectsCompleted || 0,
      label: aboutConfig?.stats?.projects,
    },
    { value: statsObj.happyClients || 0, label: aboutConfig?.stats?.clients },
  ];

  return (
    <BentoItem
      className={cn(className)}
      title={aboutConfig?.title}
      description={description}
      header={<AboutIllustration />}
      icon={<FaUser className="h-10 w-10 text-muted-foreground" />}
    >
      <div className="flex mt-2 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={cn(
              "text-center bg-background/5 p-2 flex-1 border border-border",
              rounded
            )}
          >
            <div className="text-xl font-bold text-secondary">
              {stat.value}+
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <Button to="/about" variant="secondary" className="w-full mt-4">
        {aboutConfig?.button}
      </Button>
    </BentoItem>
  );
};

export default AboutPreview;
