import React from "react";

import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";

const UnsavedChangesNotifier = ({ isDirty, isSaving, error, onSave }) => {
  return (
    <>
      {(isDirty || isSaving || error) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div
            className={`pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-border ${
              error
                ? "bg-destructive/90 text-destructive-foreground"
                : "bg-popover/80 text-foreground"
            } min-w-[200px] justify-center transition-colors duration-300`}
          >
            {/* Status Icons */}
            <div className="flex items-center gap-2">
              {error ? (
                <FaExclamationTriangle className="text-destructive-foreground" />
              ) : isSaving ? (
                <FaSpinner className="animate-spin text-primary" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              )}
            </div>

            {/* Message */}
            <div className="text-sm font-medium whitespace-nowrap">
              {error ? (
                <span>Please reload the page</span>
              ) : isSaving ? (
                <span>Saving changes...</span>
              ) : (
                <span>Unsaved changes</span>
              )}
            </div>

            {!isSaving && !error && onSave && (
              <button
                onClick={onSave}
                className="ml-2 bg-muted hover:bg-muted/80 text-foreground px-3 py-1 rounded-full text-xs font-bold transition-colors"
                type="button"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UnsavedChangesNotifier;
