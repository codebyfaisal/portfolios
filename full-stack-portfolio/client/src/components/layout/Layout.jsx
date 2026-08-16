import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Newsletter, Navbar, Footer, Loader } from "@/components";
import { cn } from "@/utils/cn";

import usePortfolioStore from "@/store/usePortfolioStore";

const Layout = () => {
  const { pathname } = useLocation();
  const { mobileMenuOpen } = usePortfolioStore();

  return (
    <div
      id="main-scroll-container"
      className={cn(
        "h-full w-full overflow-y-auto overflow-x-hidden bg-background/80 backdrop-blur-md text-foreground font-sans selection:bg-brand/30",
        mobileMenuOpen && "overflow-hidden",
      )}
    >
      <div className="min-h-full flex flex-col max-w-[1400px] mx-auto border-b border-border">
        <Navbar />
        <main className="grow">
          <div
            className={cn(
              pathname !== "/" && "pt-6 px-4 md:px-8 max-w-7xl mx-auto",
            )}
          >
            <Suspense fallback={<Loader />}>
              <Outlet />
            </Suspense>
          </div>
          <div className="px-4 md:px-8 max-w-7xl mx-auto my-20">
            <Newsletter />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
