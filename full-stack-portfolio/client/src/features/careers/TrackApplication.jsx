import React, { useState } from "react";
import {
  FaSearch,
  FaCheckCircle,
  FaCircle,
  FaInfoCircle,
  FaEnvelope,
  FaEye,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
import axios from "@/api/axios";
import usePortfolioStore from "@/store/usePortfolioStore";
import { Button, TrackSkeleton, Input, SEO } from "@/components";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const TrackApplication = () => {
  const { rounded } = usePortfolioStore();
  const [email, setEmail] = useState("");
  const [applications, setApplications] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);
    setApplications(null);

    try {
      const { data } = await axios.post("/applications/track", { email });
      setApplications(data.data);
      if (data.data.length === 0) {
        setError("No applications found for this email.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applications.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepStyles = (status) => {
    switch (status) {
      case "Pending":
        return {
          active: "border-yellow-500 bg-yellow-500/10 text-yellow-500",
          bar: "bg-yellow-500",
        };
      case "Reviewed":
        return {
          active: "border-blue-500 bg-blue-500/10 text-blue-500",
          bar: "bg-blue-500",
        };
      case "Shortlisted":
        return {
          active: "border-emerald-500 bg-emerald-500/10 text-emerald-500",
          bar: "bg-emerald-500",
        };
      case "Rejected":
        return {
          active: "border-red-500 bg-red-500/10 text-red-500",
          bar: "bg-red-500",
        };
      default:
        return {
          active: "border-border bg-primary text-muted-foreground",
          bar: "bg-primary",
        };
    }
  };

  const StatusStep = ({ status, currentStatus, isLast }) => {
    const steps = ["Pending", "Reviewed", "Shortlisted", "Rejected"];
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(status);

    const isCompleted =
      currentStatus === "Rejected"
        ? stepIndex < currentIndex
        : stepIndex <= currentIndex;
    const isCurrent = status === currentStatus;

    const styles = getStepStyles(status);

    return (
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "w-6 h-6 flex items-center justify-center border-2 transition-colors duration-300 z-10",
              isCompleted || isCurrent ? styles.active : "bg-card",
              rounded,
            )}
          >
            {isCompleted || isCurrent ? (
              <FaCheckCircle size={10} />
            ) : (
              <FaCircle size={6} />
            )}
          </div>
          {isLast && (
            <div
              className={cn(
                "w-0.5 grow my-1 bg-primar",
                stepIndex < currentIndex
                  ? getStepStyles(steps[stepIndex]).bar
                  : "bg-primary",
              )}
            ></div>
          )}
        </div>
        <div className="pb-6">
          <h4
            className={cn(
              "text-sm font-semibold translate-y-1",
              isCurrent ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {status}
          </h4>
        </div>
      </div>
    );
  };

  const ApplicationDetailsModal = ({ app, onClose, rounded }) => {

    if (!app) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-card backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "w-full max-w-2xl bg-card border border-border overflow-hidden max-h-[90vh] flex flex-col",
            rounded,
          )}
        >
          <div className="p-6 border-b border-border flex justify-between items-center sticky top-0">
            <h3 className="text-xl font-bold text-foreground">
              Application Details
            </h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close details"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto space-y-6">
            <div>
              <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-2">
                Applied For
              </h4>
              <p className="text-lg text-foreground font-medium">
                {app.job?.title || app.form?.title || "General Application"}
              </p>
              <div className="flex gap-2 mt-2">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium border",
                    app.status === "Pending"
                      ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/10"
                      : app.status === "Reviewed"
                        ? "text-blue-400 border-blue-400/20 bg-blue-400/10"
                        : app.status === "Rejected"
                          ? "text-red-400 border-red-400/20 bg-red-400/10"
                          : "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
                  )}
                >
                  {app.status}
                </span>
                <span className="text-xs text-muted-foreground flex items-center">
                  Submitted on {format(new Date(app.createdAt), "PPP")}
                </span>
              </div>
            </div>
            {app.coverLetter && (
              <div>
                <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-2">
                  Cover Letter
                </h4>
                <div
                  className={cn(
                    "p-4 bg-card border border-border text-sm whitespace-pre-wrap",
                    rounded,
                  )}
                >
                  {app.coverLetter}
                </div>
              </div>
            )}
            {app.answers && app.answers.length > 0 && (
              <div>
                <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-2">
                  Questionnaire
                </h4>
                <div className="space-y-3">
                  {app.answers?.map((ans, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-3 bg-card border border-border",
                        rounded,
                      )}
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {ans.label}
                      </p>
                      <p className="text-foreground/80 text-sm">
                        {Array.isArray(ans.answer)
                          ? ans.answer.join(", ")
                          : ans.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-2">
                Attachments
              </h4>
              <div className="flex gap-3">
                {app.resumeLink ? (
                  <a
                    href={app.resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:text-primary/50 text-sm flex items-center gap-2"
                  >
                    Resume <FaExternalLinkAlt size={10} />
                  </a>
                ) : (
                  <span className="text-muted-foreground/50 text-sm">
                    No Resume
                  </span>
                )}

                {app.portfolioLink && (
                  <a
                    href={app.portfolioLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:text-pink-300 text-sm flex items-center gap-2"
                  >
                    Portfolio <FaExternalLinkAlt size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-border flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <SEO
        title="Track Applications"
        description="Track the status of your applications submitted to my portfolio."
        keywords={["Application Tracker", "Job Status", "Portfolio"]}
      />
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Track Applications
        </h1>
        <p className="text-foreground text-lg">
          Enter your email to check the status of all your applications.
        </p>
      </div>

      <div
        className={cn(
          "border border-border p-6 md:p-8 backdrop-blur-sm",
          rounded,
        )}
      >
        <form onSubmit={handleTrack} className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none opacity-70">
              <FaEnvelope />
            </div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email Address"
              className={cn("pl-12 focus:border-secondary", rounded)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              "Searching..."
            ) : (
              <span className="flex items-center gap-1">
                <FaSearch /> Track
              </span>
            )}
          </Button>
        </form>

        {error && (
          <div
            className={cn(
              "p-4 bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3 mb-6",
              rounded,
            )}
          >
            <FaInfoCircle />
            {error}
          </div>
        )}

        {isLoading && <TrackSkeleton />}

        {!isLoading && applications && applications.length > 0 && (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className={cn("border border-border p-6", rounded)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {app.job?.title || app.form?.title || "Application"}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Submitted on {format(new Date(app.createdAt), "PPP")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={cn(
                        "px-3 py-1 text-xs font-semibold border",
                        rounded,
                        app.status === "Pending"
                          ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/10"
                          : app.status === "Reviewed"
                            ? "text-blue-400 border-blue-400/20 bg-blue-400/10"
                            : app.status === "Rejected"
                              ? "text-red-400 border-red-400/20 bg-red-400/10"
                              : "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
                      )}
                    >
                      {app.status}
                    </div>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-xs text-primary hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <FaEye /> View Details
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <StatusStep status="Pending" currentStatus={app.status} />
                  <StatusStep status="Reviewed" currentStatus={app.status} />
                  <StatusStep status="Shortlisted" currentStatus={app.status} />
                  <StatusStep
                    status="Rejected"
                    currentStatus={app.status}
                    isLast
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedApp && (
        <ApplicationDetailsModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          rounded={rounded}
        />
      )}
    </div>
  );
};

export default TrackApplication;
