import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/components";
import usePortfolioStore from "@/store/usePortfolioStore";
import { siteConfig } from "@/config/siteConfig";
import { RiMenu4Fill, RiMenuFill } from "react-icons/ri";

const Navbar = () => {
  const { user, isRounded, mobileMenuOpen, setMobileMenuOpen, config } =
    usePortfolioStore();
  const username = user?.username || siteConfig.navigation.brandFallback;
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Glider Animation State
  const [gliderStyle, setGliderStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const navRef = useRef(null);
  const linkRefs = useRef({});

  const updateGlider = (element) => {
    if (element && navRef.current) {
      const { offsetLeft, offsetWidth } = element;
      setGliderStyle((prev) => {
        if (prev.left === offsetLeft && prev.width === offsetWidth && prev.opacity === 1) return prev;
        return { left: offsetLeft, width: offsetWidth, opacity: 1 };
      });
    } else {
      setGliderStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
    }
  };

  useEffect(() => {
    const activeLink = linkRefs.current[location.pathname];
    updateGlider(activeLink);
  }, [location.pathname]);

  const handleMouseEnter = (path) => {
    const element = linkRefs.current[path];
    updateGlider(element);
  };

  const handleMouseLeave = () => {
    const activeLink = linkRefs.current[location.pathname];
    updateGlider(activeLink);
  };

  useEffect(() => {
    const container = document.getElementById("main-scroll-container");
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
      const activeLink = linkRefs.current[location.pathname];
      updateGlider(activeLink);
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (container) setIsScrolled(container.scrollTop > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname, setMobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  const showCareers = config?.navigation?.showCareers ?? true;

  const links = [
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Blogs", path: "/blogs" },
    ...(showCareers ? [{ name: "Careers", path: "/careers" }] : []),
    { name: "Contact", path: "/contact" },
  ];

  const menuIconClass =
    "text-xl absolute top-0 left-0 transition-opacity! duration-200!";

  return (
    <header
      className={cn(
        "z-50 transition-all duration-300 border-b py-2 sticky top-0 left-0 right-0",
        isScrolled || mobileMenuOpen
          ? "bg-background/80 backdrop-blur-md border-border"
          : "bg-transparent border-transparent",
      )}
    >
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-background/80 pointer-events-none backdrop-blur-md md:hidden z-0"></div>
      )}
      <div className="px-4 sm:px-6 lg:px-8 md:max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0 z-50 relative">
            <Link
              to="/"
              className="text-2xl font-bold text-foreground tracking-tighter capitalize"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Home"
            >
              {username}
              <span className="text-secondary">.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            ref={navRef}
            className="hidden md:flex items-center justify-end gap-px relative"
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={cn(
                "absolute h-9 bg-foreground/10 -z-10 transition-all duration-300 ease-in-out",
                isRounded ? "rounded-full" : "rounded-lg",
              )}
              style={{
                left: gliderStyle.left,
                width: gliderStyle.width,
                opacity: gliderStyle.opacity,
              }}
            />
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                ref={(el) => (linkRefs.current[link.path] = el)}
                onMouseEnter={() => handleMouseEnter(link.path)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors duration-200 relative z-10",
                  location.pathname === link.path
                    ? "text-secondary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title={link.name}
              >
                {link.name}
              </Link>
            ))}
            <div className="pl-4 border-l border-border ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden z-50">
            <ThemeToggle />
            <button
              className="text-foreground relative w-5 h-5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <RiMenu4Fill
                className={cn(
                  menuIconClass,
                  mobileMenuOpen ? "opacity-100" : "opacity-0",
                )}
              />
              <RiMenuFill
                className={cn(
                  menuIconClass,
                  mobileMenuOpen ? "opacity-0" : "opacity-100",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-background/95 backdrop-blur-xl z-40 md:hidden transition-[clip-path] duration-300 ease-in-out",
          mobileMenuOpen
            ? "[clip-path:inset(0_0_0_0)]"
            : "[clip-path:inset(0_0_0_100%)]",
        )}
      >
        <nav className="flex flex-col items-center gap-4 p-4 xs:p-6 bg-background">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-xl font-medium transition-colors duration-200 w-full text-center py-2 border-b border-border ",
                location.pathname === link.path
                  ? "text-secondary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
