import React from "react";
import usePortfolioStore from "@/store/usePortfolioStore";
import { PageHeader, Testimonials, Button, SEO, Skeleton } from "@/components";
import { FaFileDownload, FaGraduationCap, FaBriefcase } from "react-icons/fa";
import { GiSkills } from "react-icons/gi";
import { cn } from "@/utils/cn";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import { optimizeImage } from "@/utils/imageOptimizer";
import { siteConfig } from "@/config/siteConfig";

const SkeletonLoader = () => (
  <div className="max-w-7xl mx-auto px-6 space-y-32">
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="flex justify-center">
        <Skeleton className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-12 w-48" />
      </div>
    </section>
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-8 pl-4 border-l border-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-8 pl-4 border-l border-border">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const About = () => {
  const aboutConfig = siteConfig?.pages?.about;
  const { isRounded, rounded, user, config, loading } = usePortfolioStore();

  const experience = user?.experience || [];
  const education = user?.education || [];
  const skills = user?.skills || [];

  return (
    <>
      <SEO
        title={aboutConfig.seo.title}
        description={aboutConfig.seo.description}
        keywords={aboutConfig.seo.keywords}
      />

      <PageHeader
        title={{ ...aboutConfig.header }}
        description={aboutConfig.header.description}
      />
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="px-1 space-y-30">
          {/* Intro Section - Redesigned */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative flex justify-center">
              {/* Organic/Bacteria styling */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
                {/* Main Image Container */}
                <div
                  className="w-full h-full overflow-hidden shadow-2xl relative z-10 bg-primary/70"
                  style={{
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    transition: "all 0.5s ease-in-out",
                  }}
                >
                  {config.about?.image || user?.aboutImage || user?.avatar ? (
                    <img
                      src={
                        optimizeImage(
                          config.about?.image ||
                            user?.aboutImage ||
                            user?.avatar,
                          { width: 800 },
                        ) || null
                      }
                      alt={
                        user?.name?.first
                          ? `Portrait of ${user.name.first}`
                          : "Portrait of Portfolio User"
                      }
                      className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/70 flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                {/* Decorative Blobs */}
                <div
                  className="absolute inset-0 border-2 border-secondary/30 -z-10 translate-x-4 translate-y-4"
                  style={{
                    borderRadius: "50% 50% 20% 80% / 25% 80% 20% 75%",
                  }}
                />
                <div
                  className="absolute inset-0 bg-secondary/5 blur-3xl -z-20 scale-110"
                  style={{
                    borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 justify-center max-w-xl mx-auto text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                {config.about?.title || (
                  <>
                    Hello, I'm
                    <br />
                    <span className="text-secondary">
                      {user?.name?.first + " " + user?.name?.last}
                    </span>
                  </>
                )}
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed">
                <p>{config.about?.description || user?.bio}</p>
              </div>

              {user?.resume && (
                <div className="pt-4">
                  <Button
                    href={user.resume}
                    variant="secondary"
                    padding="px-8 py-4"
                    icon={FaFileDownload}
                  >
                    {aboutConfig?.buttons?.resume}
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Experience & Education */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section>
              <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                <FaBriefcase className="text-secondary -translate-y-[5px]" />
                {aboutConfig?.sections?.experience}
              </h3>
              <div className="space-y-8 pl-4 border-l border-border ml-3">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pl-4">
                    <div
                      className={cn(
                        "absolute top-1.5 -left-[22px] w-3 h-3 bg-secondary border-4 border-primary",
                        rounded,
                      )}
                    />
                    <h3 className="text-xl font-bold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="text-secondary">{exp.company}</p>
                    <p className="text-muted-foreground mb-1 capitalize">
                      {exp.location}
                    </p>
                    <p className="text-muted-foreground text-sm mb-2">
                      {new Date(exp.startDate).getFullYear()} -{" "}
                      {exp.current
                        ? "Present"
                        : new Date(exp.endDate).getFullYear()}
                    </p>
                  </div>
                ))}
                {experience.length === 0 && (
                  <p className="text-muted-foreground pl-4">
                    {aboutConfig?.emptyStates?.experience}
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                <FaGraduationCap className="text-secondary -translate-y-px" />
                {aboutConfig?.sections?.education}
              </h3>
              <div className="space-y-8 pl-4 border-l border-border ml-3">
                {education.map((edu, index) => (
                  <div key={index} className="relative pl-4">
                    <div
                      className={cn(
                        "absolute top-1.5 -left-[22px] w-3 h-3 bg-accent border-4 border-primary",
                        rounded,
                      )}
                    />
                    <h3 className="text-xl font-bold text-foreground">
                      {edu.degree}
                    </h3>
                    <p className="text-secondary capitalize">
                      {edu.institution}
                    </p>
                    <p className="text-muted-foreground mb-1 capitalize">
                      {edu.location}
                    </p>

                    <p className="text-muted-foreground text-sm mb-4">
                      {new Date(edu.startDate).getFullYear()} -{" "}
                      {edu.current
                        ? "Present"
                        : new Date(edu.endDate).getFullYear()}
                    </p>
                  </div>
                ))}
                {education.length === 0 && (
                  <p className="text-muted-foreground pl-4">
                    {aboutConfig?.emptyStates?.education}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Skills */}
          <section>
            <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
              <GiSkills className="text-secondary -translate-y-1.5 scale-x-120" />
              {aboutConfig?.sections?.skills}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 capitalize">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 border border-border grid grid-cols-3 gap-3 items-center hover:border-secondary/50 hover:bg-secondary/10 transition-colors",
                    rounded,
                  )}
                >
                  <div className="flex items-center gap-2 col-span-1">
                    {skill.icon &&
                      (skill.icon.includes("svg") ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(skill.icon),
                          }}
                          className="w-6 h-6 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-foreground [&>svg]:opacity-70"
                        />
                      ) : (
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="w-6 h-6 invert opacity-70"
                        />
                      ))}
                    <span className="text-foreground font-medium">
                      {skill.name}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex-1 border-border border h-4 flex items-center gap-1 p-2 col-span-2",
                      isRounded && "rounded-full",
                    )}
                  >
                    <div
                      className={cn(
                        "grow h-1 bg-muted",
                        isRounded && "rounded-full",
                      )}
                    >
                      <div
                        className={cn(
                          "h-full bg-secondary",
                          isRounded && "rounded-full",
                        )}
                        style={{
                          width: `${skill.level * 10}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px]">
                      {Number(skill.level) * 10}%
                    </span>
                  </div>
                </div>
              ))}
              {skills.length === 0 && (
                <p className="text-muted-foreground space-y-8 pl-4 border-l border-border">
                  {aboutConfig?.emptyStates?.skills}
                </p>
              )}
            </div>
          </section>

          <Testimonials />
        </div>
      )}
    </>
  );
};

export default About;
