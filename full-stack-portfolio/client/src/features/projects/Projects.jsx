import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import usePortfolioStore from "@/store/usePortfolioStore";
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  PageHeader,
  Plans,
  SEO,
  Button,
  CardSkeleton,
  NotFound,
} from "@/components";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/siteConfig";

const Projects = () => {
  const { rounded } = usePortfolioStore();
  const [projectsData, setProjectsData] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProjectsPageData = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const [projectsRes, plansRes] = await Promise.all([
        api.get(`/projects/public?page=${pageNum}&limit=6`),
        pageNum === 1 ? api.get("/services/plans") : Promise.resolve(null),
      ]);

      const { projects, hasMore: more } = projectsRes.data.data;

      if (pageNum === 1) {
        setProjectsData(projects || []);
        if (plansRes) setPlans(plansRes.data?.data || []);
      } else {
        setProjectsData((prev) => [...prev, ...(projects || [])]);
      }

      setHasMore(more);
    } catch (error) {
      console.error("Failed to fetch projects data:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProjectsPageData(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProjectsPageData(nextPage);
  };

  const projectsConfig = siteConfig?.pages?.projects;

  return (
    <>
      <SEO
        title={projectsConfig?.seo?.title}
        description={projectsConfig?.seo?.description}
        keywords={projectsConfig?.seo?.keywords}
      />

      <PageHeader
        title={projectsConfig?.header?.title}
        description={projectsConfig?.header?.description}
      />

      {loading ? (
        <CardSkeleton count={4} />
      ) : !projectsData || projectsData.length === 0 ? (
        <NotFound
          title="No Projects Found"
          description="I'm currently working on some exciting new projects. Check back soon!"
          isFullPage={false}
          backgroundText="EMPTY"
          link="/"
          backTo="Go Home"
          showBackgroundBubbles={false}
          className="my-10"
          rounded={rounded}
        />
      ) : (
        <div className="space-y-24">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectsData.map((project) => (
              <div
                key={project._id}
                className={cn(
                  "group relative h-[400px] overflow-hidden transition-all! duration-300! border border-border hover:border-secondary/20 shadow-secondary/5 hover:shadow-2xl",
                  rounded,
                )}
              >
                {/* Background Image */}
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black opacity-80" />

                {/* Hover Overlay for Links */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                  <Button
                    href={project.githubLink || "#"}
                    variant="secondary"
                    className="gap-2"
                    icon={FaGithub}
                  >
                    {projectsConfig?.buttons?.code}
                  </Button>
                  <Button
                    href={project.liveLink}
                    variant="primary"
                    className="gap-2"
                    icon={FaExternalLinkAlt}
                  >
                    {projectsConfig?.buttons?.live}
                  </Button>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-3xl font-bold text-white mb-3 capitalize">
                    {project.title}
                  </h3>
                  <Link
                    to={`/projects/${project._id}`}
                    className="inline-flex items-center gap-2 text-secondary font-bold transition opacity-0 group-hover:opacity-100 duration-300 delay-100"
                    title={`View details for ${project.title}`}
                  >
                    {projectsConfig?.buttons?.details} <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </section>

          {hasMore && (
            <div className="flex justify-center mt-12">
              <Button
                variant="secondary"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 font-semibold tracking-wide"
              >
                {loadingMore ? "Loading..." : "Load More Projects"}
              </Button>
            </div>
          )}

          {/* Web Development Plans Section */}
          {plans && plans.length > 0 && <Plans plans={plans} />}
        </div>
      )}
    </>
  );
};

export default Projects;
