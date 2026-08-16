import React from "react";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { optimizeImage } from "@/utils/imageOptimizer";
import usePortfolioStore from "@/store/usePortfolioStore";
import { Skeleton } from "@/components";
import { siteConfig } from "@/config/siteConfig";

const ProjectCard = ({ project, className }) => {
  const { rounded } = usePortfolioStore();
  return (
    <div className={cn("h-full", className)}>
      <Link
        to={`/projects/${project._id}`}
        className="group card relative block h-full overflow-hidden"
      >
        {/* Background Image */}
        {project.images && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-400 group-hover:scale-110"
            style={{
              backgroundImage: `url(${optimizeImage(project.images[0], { width: 600 })})`,
            }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-card via-card/50 to-transparent transition-colors duration-500 group-hover:bg-card/50" />
          </div>
        )}
        {!project.images && (
          <div className="absolute inset-0 bg-muted group-hover:bg-muted/80 transition-colors" />
        )}

        <div className="relative z-10 h-full p-6 flex flex-col justify-end">
          <div className="mb-auto opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:translate-y-0 duration-300">
            <span
              className={cn(
                "inline-block px-2 py-1 text-xs font-bold bg-background text-foreground mb-2",
                rounded,
              )}
            >
              {siteConfig?.pages?.home?.universe?.projects?.viewProject}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors capitalize">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

const ComingSoonCard = ({ className }) => {
  const comingSoon = siteConfig?.pages?.home?.universe?.projects?.comingSoon;
  const rounded = usePortfolioStore((state) => state.rounded);
  return (
    <div
      className={cn(
        "relative h-full bg-card/50 flex flex-col items-center justify-center text-center p-6",
        className,
      )}
    >
      <div
        className={cn(
          "w-16 h-16 bg-background/50 flex items-center justify-center mb-4 text-muted-foreground",
          rounded,
        )}
      >
        <FaLock size={24} />
      </div>
      <h4 className="text-xl font-bold text-muted-foreground mb-2">
        {comingSoon?.title}
      </h4>
      <p className="text-xs text-muted-foreground max-w-[200px]">
        {comingSoon?.description}
      </p>

      {/* Abstract Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div
          className={cn(
            "absolute -top-10 -right-10 w-40 h-40 bg-foreground/10 blur-3xl",
            rounded,
          )}
        />
        <div
          className={cn(
            "absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 blur-3xl",
            rounded,
          )}
        />
      </div>
    </div>
  );
};

const ProjectsPreview = ({ className }) => {
  const { data, rounded, loading } = usePortfolioStore();

  if (loading) {
    return (
      <div
        className={cn(
          "overflow-hidden bg-card border border-border flex flex-col",
          className,
        )}
      >
        <div className="flex-1 p-4 border-b border-border">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  const projects = data?.projects || [];
  const displayProjects = projects.slice(0, 2);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-card border border-border flex flex-col justify-between transition duration-300 hover:border-secondary/20 hover:shadow-2xl hover:shadow-secondary/5",
        rounded,
        className,
      )}
    >
      <div className="flex flex-col md:flex-row h-full divide-y md:divide-y-0 md:divide-x divide-border">
        {/* First Project */}
        <div className="flex-1 h-full relative min-h-[50%] md:min-h-full">
          {displayProjects[0] ? (
            <ProjectCard project={displayProjects[0]} className="h-full" />
          ) : (
            <ComingSoonCard className="h-full" />
          )}
        </div>

        {/* Second Project or Placeholder */}
        <div className="flex-1 h-full relative min-h-[50%] md:min-h-full">
          {displayProjects[1] ? (
            <ProjectCard project={displayProjects[1]} className="h-full" />
          ) : (
            <ComingSoonCard className="h-full" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPreview;
