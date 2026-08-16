import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "@/api/axios";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaArrowLeft,
  FaMoneyBill,
} from "react-icons/fa";
import { ApplicationForm, DetailSkeleton, NotFound, SEO } from "@/components";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { rounded } = usePortfolioStore();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/jobs/${id}`);
        setJob(data.data);
      } catch (error) {
        console.error("Failed to fetch job", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  return (
    <>
      <SEO
        title={job?.title}
        description={job?.description}
        keywords={[job?.type, job?.location, "Careers", "Job"]}
      />

      {isLoading ? (
        <DetailSkeleton />
      ) : !job ? (
        <NotFound
          title="Job Not Found"
          description="The job you are looking for does not exist or has been removed."
          isFullPage={false}
          backgroundText="EMPTY"
          link="/careers"
          backTo="Careers"
          showBackgroundBubbles={false}
          className="my-10"
          rounded={rounded}
        />
      ) : (
        <>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            title="Back to Careers"
          >
            <FaArrowLeft /> Back to Careers
          </Link>
          <section>
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-muted-foreground border-b border-border pb-8">
                <span className="flex items-center gap-2" title="Job Type">
                  <FaBriefcase className="text-secondary" />
                  {job.type}
                </span>
                <span className="flex items-center gap-2" title="Location">
                  <FaMapMarkerAlt className="text-secondary" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2" title="Posted Date">
                  <FaClock className="text-secondary" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                {job.lastDate && (
                  <span
                    className="flex items-center gap-2"
                    title="Last Date to Apply"
                  >
                    <FaClock className="text-secondary" />
                    Apply by {new Date(job.lastDate).toLocaleDateString()}
                  </span>
                )}
                {job.salary && (
                  <p
                    className="flex items-center gap-2"
                    title="Expected Salary"
                  >
                    <FaMoneyBill className="text-secondary" />
                    Expected Salary
                    <span className="flex items-center gap-1 text-foreground">
                      {job.salary.currency} {job.salary.min.toLocaleString()} -{" "}
                      {job.salary.currency} {job.salary.max.toLocaleString()}
                    </span>
                  </p>
                )}
                <span
                  className={cn(
                    "px-3 py-1 text-xs font-bold",
                    job.status === "Open"
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-red-500/20 text-red-500",
                    rounded,
                  )}
                  title="Job Status"
                >
                  {job.status}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    About the Role
                  </h3>
                  <div className="text-primary leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </div>
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">
                      Requirements
                    </h3>
                    <ul className="space-y-3">
                      {job.requirements.map((req, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-primary"
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 bg-primary mt-2.5 shrink-0",
                              rounded,
                            )}
                          />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                {job.lastDate && new Date(job.lastDate) < new Date() ? (
                  <div
                    className={cn(
                      "bg-red-500/10 border border-red-500/20 p-8 text-center",
                      rounded,
                    )}
                  >
                    <h3 className="text-3xl font-bold text-red-500 mb-2">
                      Applications Closed
                    </h3>
                    <p className="text-primary">
                      The deadline for this position was{" "}
                      {new Date(job.lastDate).toLocaleDateString()}.
                    </p>
                  </div>
                ) : (
                  <ApplicationForm
                    jobId={job._id}
                    questions={job.form?.questions}
                  />
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default JobDetail;
