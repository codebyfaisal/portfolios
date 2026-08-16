import React, { useEffect, useState } from "react";
import { FaBriefcase, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import axios from "@/api/axios";
import { Button, PageHeader, SEO, CardSkeleton, NotFound } from "@/components";
import { siteConfig } from "@/config/siteConfig";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";

const Careers = () => {
  const careersConfig = siteConfig?.pages?.careers;
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rounded } = usePortfolioStore();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("/jobs?status=Open");
        setJobs(data.data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <>
      <SEO
        title={careersConfig.seo.title}
        description={careersConfig.seo.description}
        keywords={careersConfig.seo.keywords}
      />

      <PageHeader
        title={careersConfig.header.title}
        description={careersConfig.header.description}
      />

      {isLoading ? (
        <CardSkeleton count={4} />
      ) : jobs.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className={cn(
                "group bg-card/50 hover:bg-card border border-border p-6 transition-all! duration-300! hover:border-secondary/20 hover:shadow-2xl hover:shadow-secondary/5",
                rounded,
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground transition-colors duration-300">
                    <span className="flex items-center gap-2">
                      <FaBriefcase className="text-secondary" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-secondary" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-2 text-primary">
                        {job.salary.currency} {job.salary.min.toLocaleString()}{" "}
                        - {job.salary.max.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  to={`/careers/${job._id}`}
                  variant="primary"
                  className={cn(
                    "mt-auto uppercase tracking-wider text-xs min-w-max flex items-center gap-2",
                  )}
                  title={`Apply for ${job.title}`}
                >
                  <span className="translate-y-px">Apply Now</span>
                  <FaArrowRight size={14} />
                </Button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <NotFound
          title={careersConfig.notFound.title}
          description={careersConfig.notFound.description}
          isFullPage={false}
          backgroundText="EMPTY"
          link="/"
          backTo="Home"
          showBackgroundBubbles={false}
          className="my-10"
          rounded={rounded}
        />
      )}
    </>
  );
};

export default Careers;
