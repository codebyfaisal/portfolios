import React from "react";
import { FaBars } from "react-icons/fa";
import useDashboardStore from "@/store/useDashboardStore";
import { ThemeToggle } from "@/components";

const Header = () => {
  const { openSidebar, pageHeader } = useDashboardStore();
  const { title, description, actions } = pageHeader || {};

  return (
    <header className="h-16 shrink-0 bg-card/80 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between z-40 sticky top-0">
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={openSidebar}
          className="p-2 text-muted-foreground hover:text-foreground lg:hidden rounded-lg hover:bg-muted transition-colors shrink-0"
          aria-label="Open Sidebar"
        >
          <FaBars size={18} />
        </button>

        <div className="overflow-hidden">
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight capitalize truncate">
            {title || "Dashboard"}
          </h1>
          {description && (
            <p className="text-xs text-muted-foreground truncate hidden md:block">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

export default Header;
