import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen bg-card flex flex-col items-center justify-center text-foreground z-50 fixed inset-0">
      <div className="relative w-24 h-24 mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-border rounded-3xl" />

        {/* Spinning Ring */}
        <div className="absolute inset-0 border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent rounded-3xl animate-spin" />

        {/* Inner Pulse */}
        <div className="absolute inset-4 bg-secondary/20 rounded-3xl blur-md" />
      </div>

      <div className="text-xl font-bold tracking-[0.2em] text-foreground/80 uppercase">
        Loading
      </div>
    </div>
  );
};

export default Loader;
