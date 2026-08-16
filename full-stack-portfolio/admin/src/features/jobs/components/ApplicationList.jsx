import React from "react";
import {
  FaExternalLinkAlt,
  FaEye,
  FaCheck,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { Button, Card } from "@/components";
import ApplicationSkeleton from "./ApplicationSkeleton";
import { motion } from "motion/react";

const ApplicationList = ({
  applications,
  isLoading,
  onStatusUpdate,
  onDelete,
  onView,
}) => {
  return (
    <Card className="overflow-hidden p-0 border-border">
      <div className="overflow-x-auto">
        <div className="min-w-4xl">
          {/* Header */}
          <div className="grid grid-cols-[1.5fr_1.2fr_120px_120px_140px_80px] gap-4 bg-muted/50 text-muted-foreground uppercase font-medium text-xs px-6 py-3 border-b border-border">
            <div className="flex items-center">Applicant</div>
            <div className="flex items-center">Job Title</div>
            <div className="flex items-center">Applied Date</div>
            <div className="flex items-center">Status</div>
            <div className="flex items-center">Links</div>
            <div className="flex items-center justify-end">Actions</div>
          </div>

          {/* Body */}
          <div className="divide-y divide-border">
            {isLoading ? (
              <ApplicationSkeleton />
            ) : (
              applications.map((app, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={app._id}
                  className="grid grid-cols-[1.5fr_1.2fr_120px_120px_140px_80px] gap-4 px-6 py-4 hover:bg-muted/30 transition-colors items-center"
                >
                  {/* Applicant */}
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-foreground truncate">
                      {app.applicant?.name || app.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {app.applicant?.email || app.email}
                    </span>
                    {app.coverLetter && (
                      <span className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                        "{app.coverLetter}"
                      </span>
                    )}
                  </div>

                  {/* Job Title */}
                  <div className="font-medium text-foreground truncate">
                    {app.job?.title || app.form?.title || "Unknown"}
                  </div>

                  {/* Date */}
                  <div className="text-muted-foreground text-sm">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        app.status === "Reviewed"
                          ? "text-blue-400 border-blue-400/20 bg-blue-400/10"
                          : app.status === "Shortlisted"
                          ? "text-green-400 border-green-400/20 bg-green-400/10"
                          : app.status === "Rejected"
                          ? "text-red-400 border-red-400/20 bg-red-400/10"
                          : "text-yellow-400 border-yellow-400/20 bg-yellow-400/10"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {(app.applicant?.resumeLink || app.resumeLink) && (
                      <a
                        href={app.applicant?.resumeLink || app.resumeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium"
                        title="View Resume"
                      >
                        <FaExternalLinkAlt size={12} /> Resume
                      </a>
                    )}
                    {(app.applicant?.portfolioLink || app.portfolioLink) && (
                      <a
                        href={app.applicant?.portfolioLink || app.portfolioLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-pink-400 hover:text-pink-300 flex items-center gap-1 text-sm font-medium"
                        title="View Portfolio"
                      >
                        <FaExternalLinkAlt size={12} /> Portfolio
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => onView(app)}
                      uiType="action"
                      icon={<FaEye />}
                      title="View"
                    />
                    <Button
                      onClick={() => onStatusUpdate(app._id, "Shortlisted")}
                      uiType="action"
                      icon={<FaCheck />}
                      title="Shortlist"
                    />
                    <Button
                      onClick={() => onStatusUpdate(app._id, "Rejected")}
                      uiType="action"
                      icon={<FaTimes />}
                      title="Reject"
                    />
                    <Button
                      onClick={() => onDelete(app._id)}
                      uiType="action"
                      icon={<FaTrash />}
                      title="Delete"
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationList;
