import React from "react";
import LogoPulse from "./LogoPulse";
import { FaExclamationTriangle, FaFolderOpen, FaSync } from "react-icons/fa";
import Button from "./Button";

const DataStateWrapper = ({
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyMessage = "No data found.",
  onRetry = null,
  children,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-[250px] w-full flex items-center justify-center p-8 bg-card/50 border border-border rounded-xl">
        <LogoPulse />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] w-full flex flex-col items-center justify-center p-8 bg-destructive/10 border border-destructive/20 rounded-xl text-center space-y-4">
        <FaExclamationTriangle className="text-destructive text-3xl" />
        <div className="space-y-1">
          <h4 className="font-semibold text-foreground">Failed to Load Data</h4>
          <p className="text-sm text-muted-foreground">{typeof error === "string" ? error : "An unexpected error occurred."}</p>
        </div>
        {onRetry && (
          <Button
            label="Try Again"
            icon={<FaSync />}
            uiType="secondary"
            onClick={onRetry}
          />
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-[200px] w-full flex flex-col items-center justify-center p-8 bg-muted/40 border border-border rounded-xl text-center space-y-3">
        <FaFolderOpen className="text-muted-foreground text-3xl" />
        <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default DataStateWrapper;
