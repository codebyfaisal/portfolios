import React from "react";
import { FaEdit, FaExternalLinkAlt, FaTrash, FaUsers } from "react-icons/fa";
import { Button, Card } from "@/components";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CLIENT_URL } from "@/utils/constant";

const JobList = ({ jobs, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4">
      {jobs?.map((job, index) => (
        <motion.div
          key={job._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-foreground">
                  {job.title}
                </h3>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full border ${
                    job.status === "Open"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <div className="text-muted-foreground text-sm flex gap-4">
                <span>{job.type}</span>
                <span>&bull;</span>
                <span>{job.location}</span>
                {job.salary && (
                  <>
                    <span>&bull;</span>
                    <span>
                      {job.salary.min} - {job.salary.max} {job.salary.currency}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Button
                uiType="secondary"
                icon={<FaUsers />}
                label="Applications"
                onClick={() => navigate(`/applications?jobId=${job._id}`)}
                title="View Applications"
                className="mr-2"
              />
              <Button
                uiType="action"
                icon={<FaExternalLinkAlt size={13} />}
                onClick={() => window.open(`${CLIENT_URL}/careers/${job._id}`)}
                title="View Job"
              />
              <Button
                onClick={() => onEdit(job)}
                uiType="action"
                icon={<FaEdit />}
                title="Edit"
              />
              <Button
                onClick={() => onDelete(job._id)}
                uiType="action"
                icon={<FaTrash />}
                title="Delete"
              />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default JobList;
