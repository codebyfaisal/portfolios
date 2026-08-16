import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import {
  PageHeader,
  Button,
  ConfirmationModal,
  NotFound,
  Modal,
  Select,
  Input,
} from "@/components";
import ApplicationList from "./components/ApplicationList";

import toast from "react-hot-toast";

import {
  FaExternalLinkAlt,
  FaTimes,
  FaSearch,
  FaInbox,
  FaFilter,
} from "react-icons/fa";
import { RightSidebar } from "@/components";
import useDashboardStore from "@/store/useDashboardStore";

const JobApplications = () => {
  const applications = useDashboardStore((state) => state.applications);
  const isApplicationsLoading = useDashboardStore(
    (state) => state.isApplicationsLoading,
  );
  const jobs = useDashboardStore((state) => state.jobs);

  const {
    fetchApplications,
    updateApplicationStatus,
    deleteApplication,
    resetApplicationsState,
    fetchJobs,
  } = useDashboardStore();

  const [deleteId, setDeleteId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    search: "",
    jobId: searchParams.get("jobId") || "",
    status: "",
    from: "",
    to: "",
  }));

  useEffect(() => {
    fetchJobs();
    fetchApplications();

    return () => resetApplicationsState();
  }, []);

  useEffect(() => {
    const currentJobId = searchParams.get("jobId") || "";
    if (filters.jobId !== currentJobId) {
      if (filters.jobId) setSearchParams({ jobId: filters.jobId });
      else setSearchParams({});
    }
  }, [filters.jobId, searchParams, setSearchParams]);

  const filteredApplications = React.useMemo(() => {
    if (!applications) return [];

    return applications.filter((app) => {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = (app.applicant?.name || app.fullName || "")
        .toLowerCase()
        .includes(searchLower);
      const emailMatch = (app.applicant?.email || app.email || "")
        .toLowerCase()
        .includes(searchLower);
      const matchesSearch = !filters.search || nameMatch || emailMatch;

      const matchesJob =
        !filters.jobId ||
        app.job?._id === filters.jobId ||
        app.job === filters.jobId;

      const matchesStatus = !filters.status || app.status === filters.status;

      let matchesDate = true;
      if (filters.from || filters.to) {
        const appDate = new Date(app.createdAt).setHours(0, 0, 0, 0);
        const fromDate = filters.from
          ? new Date(filters.from).setHours(0, 0, 0, 0)
          : null;
        const toDate = filters.to
          ? new Date(filters.to).setHours(23, 59, 59, 999)
          : null;

        if (fromDate && appDate < fromDate) matchesDate = false;
        if (toDate && appDate > toDate) matchesDate = false;
      }

      return matchesSearch && matchesJob && matchesStatus && matchesDate;
    });
  }, [applications, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", jobId: "", status: "", from: "", to: "" });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteApplication(deleteId);
      toast.success("Application deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete application");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      toast.success(`Marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Review applications for your job postings."
        children={
          <Button
            onClick={() => setShowFilters(true)}
            icon={<FaFilter />}
            label="Filters"
            uiType="secondary"
            className="hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-300"
          />
        }
      />

      <div className="space-y-4">
        {!isApplicationsLoading &&
        (!filteredApplications || filteredApplications.length === 0) ? (
          filters.search ||
          filters.jobId ||
          filters.status ||
          filters.from ||
          filters.to ? (
            <NotFound
              Icon={FaInbox}
              message="No applications found matching your criteria."
            />
          ) : (
            <NotFound Icon={FaInbox} message="No applications received yet." />
          )
        ) : (
          <ApplicationList
            applications={filteredApplications}
            isLoading={isApplicationsLoading}
            onView={setSelectedApp}
            onStatusUpdate={handleStatusUpdate}
            onDelete={setDeleteId}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Application?"
        message="Are you sure you want to delete this application permanently?"
        confirmText="Delete"
        isDangerous={true}
      />

      {/* Application Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title="Application Details"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase">
                Applicant
              </h3>
              <p className="text-xl font-bold text-foreground">
                {selectedApp.applicant?.name || selectedApp.fullName}
              </p>
              <p className="text-muted-foreground">
                {selectedApp.applicant?.email || selectedApp.email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase">
                  Applied For
                </h3>
                <p className="text-foreground font-medium">
                  {selectedApp.job?.title ||
                    selectedApp.form?.title ||
                    "General Application"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase">
                  Status
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    selectedApp.status === "Reviewed"
                      ? "text-blue-400 border-blue-400/20 bg-blue-400/10"
                      : selectedApp.status === "Shortlisted"
                        ? "text-green-400 border-green-400/20 bg-green-400/10"
                        : selectedApp.status === "Rejected"
                          ? "text-red-400 border-red-400/20 bg-red-400/10"
                          : "text-yellow-400 border-yellow-400/20 bg-yellow-400/10"
                  }`}
                >
                  {selectedApp.status}
                </span>
              </div>
            </div>

            {selectedApp.coverLetter && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                  Cover Letter
                </h3>
                <div className="p-4 bg-muted/20 border border-border rounded-lg text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            {selectedApp.answers && selectedApp.answers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                  Questionnaire
                </h3>
                <div className="space-y-3 bg-muted/20 border border-border rounded-lg p-4">
                  {selectedApp.answers.map((ans, idx) => (
                    <div
                      key={idx}
                      className="border-b border-border last:border-0 pb-3 last:pb-0"
                    >
                      <p className="text-muted-foreground text-sm mb-1">
                        {ans.label}
                      </p>
                      <p className="text-foreground">
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
              <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                Attachments
              </h3>
              <div className="flex gap-4">
                {selectedApp.applicant?.resumeLink || selectedApp.resumeLink ? (
                  <a
                    href={
                      selectedApp.applicant?.resumeLink ||
                      selectedApp.resumeLink
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary hover:bg-primary/20 transition-colors"
                  >
                    <FaExternalLinkAlt size={12} /> Resume
                  </a>
                ) : (
                  <span className="text-muted-foreground text-sm italic">
                    No Resume provided
                  </span>
                )}
                {(selectedApp.applicant?.portfolioLink ||
                  selectedApp.portfolioLink) && (
                  <a
                    href={
                      selectedApp.applicant?.portfolioLink ||
                      selectedApp.portfolioLink
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400 hover:bg-pink-500/20 transition-colors"
                  >
                    <FaExternalLinkAlt size={12} /> Portfolio
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                onClick={() => setSelectedApp(null)}
                uiType="secondary"
                label="Close"
              />
            </div>
          </div>
        </Modal>
      )}
      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Applications"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={clearFilters}
              label="Reset Filters"
              uiType="secondary"
              className="w-full"
              icon={<FaTimes />}
            />
            <Button
              onClick={() => setShowFilters(false)}
              label="Run Search"
              uiType="primary"
              className="w-full"
              icon={<FaSearch />}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            placeholder="Search by name or email..."
            icon={<FaSearch />}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            label="Search Query"
          />
          <Select
            label="Job Position"
            value={filters.jobId}
            onChange={(value) => handleFilterChange("jobId", value)}
            options={[
              { value: "", label: "All Jobs" },
              ...jobs.map((j) => ({ value: j._id, label: j.title })),
            ]}
          />
          <Select
            label="Application Status"
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            options={[
              { value: "", label: "All Statuses" },
              { value: "Pending", label: "Pending" },
              { value: "Reviewed", label: "Reviewed" },
              { value: "Shortlisted", label: "Shortlisted" },
              { value: "Rejected", label: "Rejected" },
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.from}
              onChange={(e) => handleFilterChange("from", e.target.value)}
              max={filters.to}
              label="From Date"
            />
            <Input
              type="date"
              value={filters.to}
              onChange={(e) => handleFilterChange("to", e.target.value)}
              min={filters.from}
              max={new Date().toISOString().split("T")[0]}
              label="To Date"
            />
          </div>
        </div>
      </RightSidebar>
    </div>
  );
};

export default JobApplications;
