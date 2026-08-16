import React from "react";
import usePortfolioStore from "@/store/usePortfolioStore";
import { RenderIcon } from "@/components";
import { cn } from "@/utils/cn";

const AboutIllustration = React.memo(() => {
  const { rounded } = usePortfolioStore();
  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[220px] p-6 flex items-center justify-center bg-muted/50 overflow-hidden transition-colors duration-300",
        rounded
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5" />

      {/* Abstract UI Window */}
      <div
        className={cn(
          "w-full max-w-[200px] bg-card border border-border overflow-hidden",
          rounded
        )}
      >
        {/* Header */}
        <div className="h-6 bg-muted border-b border-border flex items-center px-2 gap-1.5">
          <div className={cn("w-2 h-2 bg-red-500/50", rounded)} />
          <div className={cn("w-2 h-2 bg-yellow-500/50", rounded)} />
          <div className={cn("w-2 h-2 bg-green-500/50", rounded)} />
        </div>
        {/* Body */}
        <div className="p-3 space-y-2">
          <div className="flex gap-2">
            <div
              className={cn(
                "w-1/3 h-16 bg-primary/10 border border-primary/20",
                rounded
              )}
            />
            <div className={cn("w-2/3 h-16 bg-muted/50", rounded)} />
          </div>
          <div className={cn("h-2 bg-muted/50 w-3/4", rounded)} />
          <div className={cn("h-2 bg-muted/50 w-1/2", rounded)} />
        </div>
      </div>

      {/* Floating Elements */}
      <div
        className={cn(
          "absolute top-4 right-8 w-10 h-10 bg-secondary/20 border border-secondary/30 flex items-center justify-center",
          rounded
        )}
      >
        <div
          className={cn(
            "w-4 h-4 bg-secondary shadow-[0_0_10px_rgba(74,222,128,0.5)]",
            rounded
          )}
        />
      </div>
    </div>
  );
});

const TechStackIllustration = React.memo(() => {
  const { user, rounded } = usePortfolioStore();
  const allSkills = user?.skills || [];
  const techStack = (
    allSkills.filter((s) => s.isTechStack).length > 0
      ? allSkills.filter((s) => s.isTechStack)
      : allSkills
  ).slice(0, 10);

  if (!techStack || techStack.length === 0) return null;

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[160px] bg-muted/50 overflow-hidden transition-colors duration-300 flex flex-wrap items-center justify-center p-4 gap-3",
        rounded
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5" />

      {techStack.map((stack, i) => (
        <div
          key={i}
          className={cn(
            "relative z-10 flex items-center justify-center p-3 bg-card border border-border shadow-md hover:scale-110 transition-transform duration-300",
            rounded
          )}
          title={stack.name}
        >
          <RenderIcon
            icon={stack.icon}
            className="[&>svg]:text-2xl text-foreground"
          />
        </div>
      ))}
    </div>
  );
});

const ServiceIllustration = React.memo(({ image }) => {
  const { rounded } = usePortfolioStore();
  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[160px] flex items-center justify-center bg-muted/50 overflow-hidden group transition-colors duration-300",
        rounded
      )}
    >
      {image ? (
        <div className="w-full h-full">
          <div className="absolute inset-0 bg-card z-10" />
          <img
            src={image}
            alt="Service"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5" />

          {/* Abstract Shapes */}
          <div className="relative z-10 grid grid-cols-2 gap-3 p-4">
            <div
              className={cn(
                "w-16 h-24 bg-card border border-border overflow-hidden group-hover:scale-105 transition-transform",
                rounded
              )}
            >
              <div className="h-full w-full bg-linear-to-b from-muted/20 to-transparent" />
            </div>
            <div className="space-y-3 pt-4">
              <div
                className={cn(
                  "w-12 h-12 bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:scale-105 transition-transform",
                  rounded
                )}
              >
                <div className={cn("w-6 h-6 bg-secondary/40", rounded)} />
              </div>
              <div className={cn("w-16 h-2 bg-card", rounded)} />
              <div className={cn("w-10 h-2 bg-card", rounded)} />
            </div>
          </div>

          {/* Decorative Elements */}
          <div
            className={cn(
              "absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl -translate-y-1/2 translate-x-1/2",
              rounded
            )}
          />
          <div
            className={cn(
              "absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 blur-xl translate-y-1/2 -translate-x-1/2",
              rounded
            )}
          />
        </>
      )}
    </div>
  );
});

const PlansIllustration = React.memo(() => {
  const { rounded } = usePortfolioStore();
  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[160px] flex items-center justify-center bg-muted/50 overflow-hidden transition-colors duration-300",
        rounded
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5" />

      <div className="flex gap-3 items-end">
        {/* Basic Plan Card */}
        <div
          className={cn(
            "w-24 h-24 bg-card border border-border p-2 flex flex-col justify-between opacity-80",
            rounded
          )}
        >
          <div
            className={cn(
              "w-8 h-8 bg-muted/50 flex items-center justify-center",
              rounded
            )}
          >
            <div className={cn("w-4 h-4 bg-muted", rounded)} />
          </div>
          <div className="space-y-1">
            <div className={cn("h-1.5 w-12 bg-muted", rounded)} />
            <div className={cn("h-1.5 w-8 bg-muted/50", rounded)} />
          </div>
        </div>

        {/* Pro Plan Card (Highlighted) */}
        <div
          className={cn(
            "w-28 h-32 bg-secondary/10 border border-secondary/30 p-3 flex flex-col justify-between relative shadow-[0_0_15px_rgba(74,222,128,0.1)]",
            rounded
          )}
        >
          <div
            className={cn(
              "absolute -top-2 -right-2 w-6 h-6 bg-secondary flex items-center justify-center text-secondary-foreground text-[10px] font-bold",
              rounded
            )}
          >
            ★
          </div>
          <div
            className={cn(
              "w-10 h-10 bg-secondary/20 flex items-center justify-center",
              rounded
            )}
          >
            <div className={cn("w-5 h-5 bg-secondary", rounded)} />
          </div>
          <div className={cn("space-y-1.5", rounded)}>
            <div className={cn("h-2 w-16 bg-muted/50 ", rounded)} />
            <div className={cn("h-2 w-10 bg-muted/30 ", rounded)} />
            <div className={cn("h-2 w-12 bg-muted/30 ", rounded)} />
          </div>
        </div>

        {/* Enterprise Plan Card */}
        <div
          className={cn(
            "w-24 h-24 bg-card border border-border p-2 flex flex-col justify-between opacity-80",
            rounded
          )}
        >
          <div className="w-8 h-8 bg-muted/50 flex items-center justify-center">
            <div className={cn("w-4 h-4 bg-muted", rounded)} />
          </div>
          <div className="space-y-1">
            <div className={cn("h-1.5 w-12 bg-muted", rounded)} />
            <div className={cn("h-1.5 w-8 bg-muted/50", rounded)} />
          </div>
        </div>
      </div>
    </div>
  );
});

const ContactIllustration = React.memo(() => {
  const { rounded } = usePortfolioStore();
  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[160px] flex items-center justify-center bg-muted/50 overflow-hidden transition-colors duration-300",
        rounded
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5" />

      <div className="relative grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "w-10 h-10 bg-card border border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground text-muted-foreground transition-colors duration-300",
              rounded
            )}
          >
            <div className={cn("w-4 h-4 bg-current opacity-50", rounded)} />
          </div>
        ))}
      </div>
    </div>
  );
});
export {
  TechStackIllustration,
  AboutIllustration,
  ContactIllustration,
  PlansIllustration,
  ServiceIllustration,
};
