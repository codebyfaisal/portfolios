import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import {
  Layout,
  ScrollToTop,
  ErrorBoundary,
  SEO,
  PrivacyBanner,
} from "@/components";

const Home = React.lazy(() => import("@/features/home/Home"));
const About = React.lazy(() => import("@/features/about/About"));
const Services = React.lazy(() => import("@/features/services/Services"));
const ServiceDetail = React.lazy(
  () => import("@/features/services/ServiceDetail"),
);
const Projects = React.lazy(() => import("@/features/projects/Projects"));
const ProjectDetail = React.lazy(
  () => import("@/features/projects/ProjectDetail"),
);
const Blogs = React.lazy(() => import("@/features/blogs/Blogs"));
const BlogPost = React.lazy(() => import("@/features/blogs/BlogPost"));
const Careers = React.lazy(() => import("@/features/careers/Careers"));
const JobDetail = React.lazy(() => import("@/features/careers/JobDetail"));
const FormView = React.lazy(() => import("@/features/forms/FormView"));
const TrackApplication = React.lazy(
  () => import("@/features/careers/TrackApplication"),
);
const Contact = React.lazy(() => import("@/features/contact/Contact"));
const NotFound = React.lazy(() => import("@/features/error/NotFound"));

import ServerError from "@/features/error/ServerError";
import Maintenance from "@/features/error/Maintenance";
import usePortfolioStore from "@/store/usePortfolioStore";
import { BASE_API_URL } from "@/api/axios";

import { ThemeProvider } from "@/context/ThemeContext";

function App() {
  const { fetchHomeData, config, serverError } = usePortfolioStore();

  if (serverError) return <ServerError />;

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <InnerApp config={config} fetchHomeData={fetchHomeData} />
    </ThemeProvider>
  );
}

function InnerApp({ config, fetchHomeData }) {
  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  useEffect(() => {
    if (config?.maintenance?.enabled) return;

    const logVisit = async () => {
      try {
        let userAgent = navigator.userAgent;
        const brands = navigator.userAgentData?.brands;
        const braveBrand = brands?.find(
          (b) => b.brand.toLowerCase() === "brave",
        );

        if (braveBrand || navigator.brave) {
          const version = braveBrand?.version ?? "";
          userAgent += ` Brave/${version}`;
        }

        await fetch(`${BASE_API_URL}/visits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page: window.location.pathname, userAgent }),
          credentials: "include",
        });
      } catch (error) {
        console.error("Failed to log visit:", error);
      }
    };

    logVisit();
  }, [config?.maintenance?.enabled]);

  useEffect(() => {
    if (config) {
      const root = document.documentElement;
      const borderRadius = config.appearance?.theme?.borderRadius;
      const isCustom = config.appearance?.theme?.isCustom;
      const colors = config.appearance?.theme?.colors;

      if (borderRadius) {
        root.style.setProperty("--radius-2xl", "1rem");
        root.style.setProperty("--radius-xl", "0.75rem");
        root.style.setProperty("--radius-lg", "0.5rem");
        root.style.setProperty("--radius-md", "0.375rem");
        root.style.setProperty("--radius-sm", "0.125rem");
      } else {
        root.style.setProperty("--radius-2xl", "0px");
        root.style.setProperty("--radius-xl", "0px");
        root.style.setProperty("--radius-lg", "0px");
        root.style.setProperty("--radius-md", "0px");
        root.style.setProperty("--radius-sm", "0px");
      }

      if (isCustom && colors) {
        if (colors.secondary)
          root.style.setProperty("--color-secondary", colors.secondary);
      } else root.style.removeProperty("--color-secondary");
    }
  }, [config]);

  if (config?.maintenance?.enabled) {
    return <Maintenance config={config} />;
  }

  return (
    <Router>
      <ErrorBoundary>
        <SEO />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#fff",
              border: "1px solid #27272a",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:id" element={<ServiceDetail />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:slug" element={<BlogPost />} />
            <Route path="careers" element={<Careers />} />
            <Route path="careers/:id" element={<JobDetail />} />
            <Route path="forms/:id" element={<FormView />} />
            <Route path="track-application" element={<TrackApplication />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <PrivacyBanner />
        <ScrollToTop />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
