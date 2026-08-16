import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaProjectDiagram,
  FaServicestack,
  FaCog,
  FaHome,
  FaCommentDots,
  FaEnvelope,
  FaFolder,
  FaMoneyBill,
  FaTimes,
  FaUsers,
  FaNewspaper,
  FaList,
  FaBriefcase,
  FaInbox,
  FaWpforms,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";
import clsx from "clsx";
import useDashboardStore from "@/store/useDashboardStore";
import { ThemeToggle } from "@/components";

const Sidebar = () => {
  const { user, isSidebarOpen, closeSidebar, logout } = useDashboardStore();
  const navItems = [
    { path: "/", icon: FaHome, label: "Overview" },
    { path: "/messages", icon: FaEnvelope, label: "Messages" },
    { path: "/applications", icon: FaInbox, label: "Applications" },
    { path: "/subscribers", icon: FaList, label: "Subscribers" },
    { path: "/blogs", icon: FaNewspaper, label: "Blogs" },
    { path: "/projects", icon: FaProjectDiagram, label: "Projects" },
    { path: "/services", icon: FaServicestack, label: "Services" },
    { path: "/jobs", icon: FaBriefcase, label: "Jobs" },
    { path: "/plans", icon: FaMoneyBill, label: "Plans" },
    { path: "/testimonials", icon: FaCommentDots, label: "Testimonials" },
    { path: "/forms", icon: FaWpforms, label: "Forms" },
    { path: "/files", icon: FaFolder, label: "File Manager" },
    { path: "/visitors", icon: FaUsers, label: "Visitors" },
    { path: "/security", icon: FaShieldAlt, label: "Security" },
    { path: "/user", icon: FaUser, label: "Profile" },
    { path: "/configuration", icon: FaCog, label: "Configuration" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="px-6 py-2.5 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Portfolio Manager</p>
        </div>
        <button
          onClick={closeSidebar}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 1024) closeSidebar();
            }}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-input text-input-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <item.icon className="text-lg" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-2 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
              {(user?.name?.first || "A").charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name?.first || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
