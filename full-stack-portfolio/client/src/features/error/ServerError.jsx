import React from "react";
import { FaServer, FaRedo } from "react-icons/fa";
import { Button } from "@/components";

const ServerError = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-lg">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-2xl shadow-red-500/10 animate-pulse">
          <FaServer className="text-4xl text-red-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
            Server Connection Failed
          </h1>
          <p className="text-foreground/60 text-lg leading-relaxed">
            We're having trouble connecting to our servers. This could be due to
            temporary maintenance or a network issue.
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            className="group border border-red-500/20 hover:border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
            icon={FaRedo}
            title="Reload Page"
          >
            Try Again
          </Button>
        </div>

        <p className="text-xs text-foreground/60 font-mono">
          Error Code: 503_SERVICE_UNAVAILABLE
        </p>
      </div>
    </div>
  );
};

export default ServerError;
