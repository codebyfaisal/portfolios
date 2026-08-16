import React from "react";
import { BentoItem, Button, Skeleton, RenderIcon } from "@/components";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/siteConfig";
import { FaCode } from "react-icons/fa";
import { ServiceIllustration } from "./Illustrations";

const ServicesPreview = ({ className }) => {
  const data = usePortfolioStore((state) => state.data);
  const config = usePortfolioStore((state) => state.config);
  const loading = usePortfolioStore((state) => state.loading);

  if (loading) {
    return (
      <BentoItem className={cn(className)}>
        <Skeleton className="w-full h-full min-h-24" />
      </BentoItem>
    );
  }

  const defaultService = data?.services?.[0];

  const featuredServiceConfig = config?.featuredService || {};
  const selectedService = data?.services?.find(
    (s) => s._id === featuredServiceConfig.serviceId
  );

  const displayService = selectedService || defaultService;

  const servicesConfig = siteConfig?.pages?.home?.universe?.services;

  const serviceTitle =
    featuredServiceConfig.title ||
    displayService?.title ||
    servicesConfig?.title;

  const serviceDesc =
    featuredServiceConfig.description ||
    displayService?.description ||
    servicesConfig?.description;

  const serviceImage =
    featuredServiceConfig.image || displayService?.image || null;

  const serviceIcon =
    displayService?.icon && typeof displayService.icon === "string"
      ? displayService.icon
      : "";

  return (
    <BentoItem
      key="services-preview-item"
      className={cn(className)}
      title={serviceTitle}
      description={
        <span className="line-clamp-2 block" title={serviceDesc}>
          {serviceDesc}
        </span>
      }
      header={<ServiceIllustration image={serviceImage} />}
      icon={
        serviceIcon ? (
          <RenderIcon
            icon={serviceIcon}
            className="h-10 w-10 text-muted-foreground"
          />
        ) : (
          <FaCode className="h-10 w-10 text-muted-foreground" />
        )
      }
    >
      <Button to="/services" variant="secondary" className="w-full mt-4">
        {servicesConfig?.button}
      </Button>
    </BentoItem>
  );
};

export default ServicesPreview;
