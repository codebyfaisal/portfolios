import React from "react";

const LogoPulse = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />

        {/* Main Logo Circle */}
        <div className="relative w-20 h-20 flex items-center justify-center shadow-2xl shadow-primary/10 animate-bounce">
          <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/50 rounded-lg transform rotate-45" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground font-medium tracking-wider text-sm uppercase">
          Loading
        </span>
        <span className="text-muted-foreground animate-pulse">.</span>
        <span className="text-muted-foreground animate-pulse delay-75">.</span>
        <span className="text-muted-foreground animate-pulse delay-150">.</span>
      </div>
    </div>
  );
};

export default LogoPulse;
