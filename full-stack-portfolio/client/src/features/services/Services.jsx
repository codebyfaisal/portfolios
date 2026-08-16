import React, { useEffect, useState } from "react";
import api from "@/api/axios";

import usePortfolioStore from "@/store/usePortfolioStore";
import { FaCode } from "react-icons/fa";
import {
  Skeleton,
  NotFound,
  PageHeader,
  Plans,
  RenderIcon,
  SEO,
  Button,
} from "@/components";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/siteConfig";

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} className="h-[400px] w-full" />
    ))}
  </div>
);

const Services = () => {
  const { rounded } = usePortfolioStore();
  const [servicesData, setServicesData] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicesPageData = async () => {
      try {
        setLoading(true);
        const [servicesRes, plansRes] = await Promise.all([
          api.get("/services"),
          api.get("/services/plans"),
        ]);
        setServicesData(servicesRes.data?.data || []);
        setPlans(plansRes.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch services data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicesPageData();
  }, []);

  const servicesConfig = siteConfig?.pages?.services;
  const headerConfig = servicesConfig?.header;

  return (
    <>
      <SEO
        title={servicesConfig?.seo?.title}
        description={servicesConfig?.seo?.description}
        keywords={servicesConfig?.seo?.keywords}
      />

      <PageHeader
        title={headerConfig?.title}
        description={headerConfig?.description}
      />

      {loading ? (
        <SkeletonLoader />
      ) : !servicesData || servicesData.length === 0 ? (
        <NotFound
          title="No Services Found"
          description={headerConfig?.notFoundDesc}
          backgroundText="EMPTY"
          link="/contact"
          backTo="Contact Me"
          showBackgroundBubbles={false}
          className="my-10"
          rounded={rounded}
        />
      ) : (
        <div className="space-y-24">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service) => {
              return (
                <div
                  key={service._id}
                  className={cn("relative group", rounded)}
                >
                  <div
                    className={cn(
                      "relative h-full bg-card p-8 flex flex-col items-center text-center transition-all! duration-300! border border-border group-hover:border-secondary/20 group-hover:shadow-secondary/5 group-hover:shadow-2xl",
                      rounded,
                    )}
                  >
                    {/* Icon Box */}
                    <div
                      className={cn(
                        "w-20 h-20 mb-6 flex items-center justify-center border-2 border-primary/20 transition-transform duration-500 group-hover:rotate-6 bg-primary/10 text-primary",
                        rounded,
                      )}
                    >
                      {!service.icon || service.icon === "" ? (
                        <FaCode />
                      ) : (
                        <RenderIcon icon={service.icon} className="text-3xl" />
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-foreground mb-4 transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed transition-colors duration-300">
                      {service.description}
                    </p>

                    {/* Button */}
                    <Button
                      to={`/services/${service._id}`}
                      variant="primary"
                      className={cn("mt-auto uppercase tracking-wider text-sm")}
                    >
                      {servicesConfig?.button}
                    </Button>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Web Development Plans Section */}
          {<Plans plans={plans} />}
        </div>
      )}
    </>
  );
};

export default Services;
