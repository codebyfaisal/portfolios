import React, { useState, useEffect } from "react";
import { FaCheck, FaRocket, FaSync } from "react-icons/fa";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";
import { Button } from "@/components";
import { siteConfig } from "@/config/siteConfig";

const Plans = ({ plans }) => {
  const { rounded } = usePortfolioStore();
  const [grid, setGrid] = useState(1);
  const plansConfig = siteConfig?.plans;

  useEffect(() => {
    if (plans?.length <= 1) setGrid(1);
    else if (plans?.length <= 2) setGrid(2);
    else if (plans?.length <= 3) setGrid(3);
    else if (plans?.length <= 4) setGrid(4);
  }, [plans]);

  if (!plans || plans.length === 0) return null;

  return (
    <section>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground transition-colors duration-300">
          {plansConfig?.heading}
        </h2>
        <p className="text-muted-foreground transition-colors duration-300">
          {plansConfig?.subHeading}
        </p>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 mx-auto gap-8 items-start",
          grid === 1 && "lg:grid-cols-1 max-w-lg",
          grid === 2 && "lg:grid-cols-2 max-w-xl",
          grid === 3 && "lg:grid-cols-3 max-w-6xl",
          grid === 4 && "lg:grid-cols-4",
        )}
      >
        {plans.map((plan, index) => {
          const isPopular = plan.popular;
          return (
            <div
              key={plan._id || index}
              className={cn(
                "relative overflow-hidden bg-card p-8 border flex flex-col transition-all duration-300 h-full",
                rounded,
                isPopular
                  ? "border-secondary shadow-2xl shadow-secondary/20 scale-105 z-10"
                  : "border-border hover:border-foreground/20",
              )}
            >
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {isPopular && (
                  <p
                    className={cn(
                      "absolute -top-4 right-0 px-3 pt-1 pb-px text-xs font-bold text-primary bg-secondary uppercase tracking-wide",
                      rounded,
                    )}
                  >
                    {plansConfig?.popularTag}
                  </p>
                )}

                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-secondary transition-colors duration-300">
                    {plan.name}
                  </h3>

                  <div className="flex items-center justify-center gap-1 text-foreground transition-colors duration-300">
                    {plan.price?.min && plan.price?.max ? (
                      <div className="flex items-center gap-1">
                        <span className="text-4xl font-bold">
                          {plan.price.currency}
                          {plan.price.min}
                        </span>
                        <span className="text-muted-foreground text-2xl">
                          -
                        </span>
                        <span className="text-4xl font-bold">
                          {plan.price.currency}
                          {plan.price.max}
                        </span>
                      </div>
                    ) : plan.price?.min ? (
                      <div className="flex items-end gap-2">
                        <span className="text-lg text-muted-foreground">
                          {plansConfig?.startingAt}
                        </span>
                        <span className="text-4xl font-bold">
                          {plan.price.currency}
                          {plan.price.min}
                        </span>
                      </div>
                    ) : (
                      <span className="text-4xl font-bold">Contact</span>
                    )}
                  </div>
                </div>

                {/* Meta Info: Delivery & Addons */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  {plan.deliveryTime?.show && (
                    <div
                      className={cn(
                        "flex items-center gap-1.5 bg-foreground/5 border border-foreground/5 px-3 py-1.5 text-xs font-medium text-muted-foreground",
                        rounded,
                      )}
                    >
                      <FaRocket className="text-accent" size={10} />
                      <span>
                        {plan.deliveryTime.time} {plan.deliveryTime.unit}{" "}
                        {plansConfig?.unit}
                      </span>
                    </div>
                  )}
                  {plan.revisions?.show && (
                    <div
                      className={cn(
                        "flex items-center gap-1.5 bg-foreground/5 border border-foreground/5 px-3 py-1.5 text-xs font-medium text-secondary",
                        rounded,
                      )}
                    >
                      <FaSync className="text-secondary" size={10} />
                      <span>
                        {plan.revisions.count} {plansConfig?.revisions}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8 grow">
                  {plan.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <div
                        className={cn(
                          "w-5 h-5 flex items-center justify-center shrink-0 bg-secondary/10 text-secondary mt-0.5",
                          rounded,
                        )}
                      >
                        <FaCheck size={10} />
                      </div>
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.addOns?.show &&
                  plan.addOns.options &&
                  plan.addOns.options.length > 0 && (
                    <div className="mb-8 pt-6 border-t border-border">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 text-center">
                        {plansConfig?.addOns}
                      </h4>
                      <div className="space-y-2">
                        {plan.addOns.options.map((addon, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-muted-foreground"
                          >
                            <span
                              className={cn(
                                "w-1 h-1 bg-secondary mt-1.5 shrink-0",
                                rounded,
                              )}
                            ></span>
                            {addon}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <Button
                  to="/contact"
                  variant={
                    plan.isCustom
                      ? "white"
                      : isPopular
                        ? "primary"
                        : "secondary"
                  }
                  className={cn(
                    "w-full text-sm tracking-wide uppercase transition-all duration-300",
                    isPopular && "shadow-lg shadow-secondary/20",
                  )}
                  title={
                    plan.isCustom
                      ? plansConfig?.buttons?.contact
                      : plansConfig?.buttons?.start
                  }
                >
                  {plan.isCustom
                    ? plansConfig?.buttons?.contact
                    : plansConfig?.buttons?.start}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Plans;
