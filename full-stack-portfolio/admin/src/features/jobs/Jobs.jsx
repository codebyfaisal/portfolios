import React, { useState, useEffect } from "react";
import { FaPlus, FaBriefcase } from "react-icons/fa";
import { PageHeader, Button, ConfirmationModal, NotFound } from "@/components";
import JobSkeleton from "./components/JobSkeleton";
import JobList from "./components/JobList";
import JobForm from "./components/JobForm";
import useDashboardStore from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const Jobs = () => {
  const { jobs, fetchJobs, deleteJob, isLoading, resetJobsState } =
    useDashboardStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchJobs();
    return () => resetJobsState();
  }, [fetchJobs, resetJobsState]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteJob(deleteId);
      toast.success("Job deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Manage your job postings and openings."
      >
        <Button
          onClick={() => {
            setJobToEdit(null);
            setIsFormOpen(true);
          }}
          uiType="primary"
          icon={<FaPlus size={14} />}
          label="Post New Job"
        />
      </PageHeader>

      <div className="space-y-6">
        {!isLoading && (!jobs || jobs.length === 0) ? (
          <NotFound
            Icon={FaBriefcase}
            message="No job postings created yet."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <JobSkeleton />
            ) : (
              <JobList
                jobs={jobs}
                onEdit={(job) => {
                  setJobToEdit(job);
                  setIsFormOpen(true);
                }}
                onDelete={setDeleteId}
              />
            )}
          </div>
        )}
      </div>

      <JobForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        jobToEdit={jobToEdit}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Job?"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Jobs;
