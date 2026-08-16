import React from "react";
import { FaTools, FaShieldAlt } from "react-icons/fa";
import { cn } from "@/utils/cn";

const Maintenance = ({ config }) => {
  const maintenanceInfo = config?.maintenance || {};
  const title = maintenanceInfo.title || "Under Scheduled Maintenance";
  const message =
    maintenanceInfo.message ||
    "We are currently updating our portfolio to bring you an improved experience. We will be back online shortly!";

  const rounded = config?.appearance?.theme?.borderRadius ? "rounded-2xl" : "rounded-none";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <div
        className={cn(
          "max-w-xl w-full bg-card/70 border border-border/80 backdrop-blur-xl p-8 md:p-12 text-center shadow-2xl relative z-10 space-y-6",
          rounded
        )}
      >
        {/* Animated Badge & Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 text-3xl shadow-inner animate-pulse">
              <FaTools />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-2 rounded-full text-xs shadow-md">
              <FaShieldAlt />
            </div>
          </div>
        </div>

        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          Maintenance Mode Active
        </div>

        {/* Title & Message */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            {message}
          </p>
        </div>

        <div className="pt-4 border-t border-border/50 text-xs text-muted-foreground flex items-center justify-center gap-2">
          <span>Thank you for your patience</span>
          <span>•</span>
          <span>Check back soon</span>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
