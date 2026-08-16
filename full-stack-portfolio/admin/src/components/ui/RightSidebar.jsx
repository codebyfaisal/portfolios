import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";
import { Card } from "@/components";

const RightSidebar = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
}) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      setTimeout(() => setMounted(false), 300);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/5 backdrop-blur-xs transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <Card
        rounded="rounded-0"
        padding="p-0"
        className={cn(
          "relative w-full max-w-sm h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out",
          visible ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">{children}</div>

        {/* Footer */}
        {footer && <div className="p-4 border-t border-border">{footer}</div>}
      </Card>
    </div>,
    document.body
  );
};

export default RightSidebar;
