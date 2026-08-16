import React from "react";
import { useParams, Link } from "react-router-dom";
import usePortfolioStore from "@/store/usePortfolioStore";
import {
  FaArrowLeft,
  FaGithub,
  FaExternalLinkAlt,
  FaProjectDiagram,
} from "react-icons/fa";
import {
  Skeleton,
  ImageSlider,
  SEO,
  Button,
  Plans,
  NotFound,
} from "@/components";
import { cn } from "@/utils/cn";

const SkeletonLoader = () => {
  return (
    <>
      <Skeleton className="w-32 h-6 mb-8" />

      {/* Hero Image */}
      <Skeleton className={`w-full h-[400px] md:h-[500px] mb-8 `} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div>
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Features */}
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Links Card */}
          <div className="p-6 border border-border bg-card/50 space-y-6">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Back Button */}
          <div className="p-6 border border-border bg-card/50">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { data, rounded, loading } = usePortfolioStore();

  const project = data?.projects?.find((p) => p._id.toString() === id);

  return (
    <>
      <SEO
        title={project?.title}
        description={project?.description}
        image={project?.image}
        keywords={project?.techStack}
      />

      {loading ? (
        <SkeletonLoader />
      ) : !project ? (
        <NotFound
          title="Project Not Found"
          description="The project you are looking for might have been removed, had its URL changed, or is temporarily unavailable."
          link="/projects"
          icon={<FaProjectDiagram />}
          backTo="Back to Projects"
          rounded={rounded}
        />
      ) : (
        <>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-foreground hover:text-secondary mb-8 transition"
            title="Back to Projects"
          >
            <FaArrowLeft /> Back to Projects
          </Link>

          <section>
            <div
              className={cn(
                "relative h-[400px] md:h-[500px] w-full overflow-hidden mb-8",
                rounded,
              )}
            >
              <ImageSlider
                images={project?.images?.length > 0 ? project.images : []}
                title={project?.title}
                rounded={rounded}
              />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                  {project?.title}
                </h1>
                {project?.date && (
                  <p className="text-white/80 text-lg mb-4 flex items-center gap-2">
                    <span>{formatDate(project.date.start)}</span>
                    <span>-</span>
                    <span>
                      {project.date.ongoing
                        ? "Present"
                        : formatDate(project.date.end)}
                    </span>
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  {project?.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className={cn(
                        "px-3 py-1 text-sm bg-background text-primary backdrop-blur-md border border-border",
                        rounded,
                      )}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <article className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Overview
                  </h2>
                  <p className="text-xl text-foreground/80 leading-relaxed mb-8">
                    {project?.description}
                  </p>

                  {project?.features && project.features.length > 0 && (
                    <>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        Key Features
                      </h2>
                      <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-8">
                        {project.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </article>

              <aside className="lg:col-span-1">
                <div
                  className={cn("bg-card p-6 border border-border", rounded)}
                >
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    Project Links
                  </h3>
                  <div className="space-y-4">
                    <Button
                      href={project?.liveLink}
                      variant="primary"
                      className="w-full"
                      icon={FaExternalLinkAlt}
                      title="View Live Demo"
                    >
                      Live Demo
                    </Button>
                    <Button
                      href={project?.githubLink || "#"}
                      variant="secondary"
                      className="w-full"
                      icon={FaGithub}
                      title="View Code"
                    >
                      View Code
                    </Button>
                  </div>
                </div>
                <div
                  className={cn(
                    "bg-card p-6 mt-6 border border-border",
                    rounded,
                  )}
                >
                  <Button
                    to="/projects"
                    variant="secondary"
                    className="w-full"
                    icon={FaArrowLeft}
                    title="Back to Projects"
                  >
                    Back to Projects
                  </Button>
                </div>
              </aside>
            </div>
          </section>

          {/* Web Development Plans Section */}
          {data.services.find((s) => s._id === "web-dev") && (
            <Plans
              plans={data.services.find((s) => s._id === "web-dev").plans}
              title="Web Development Plans"
              theme="fuchsia"
            />
          )}
        </>
      )}
    </>
  );
};

export default ProjectDetail;
