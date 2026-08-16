import React from "react";
import { FaBriefcase, FaProjectDiagram, FaSmile } from "react-icons/fa";
import { Card, Input } from "@/components";

const UserStats = ({ formData, handleChange }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <FaBriefcase className="text-primary" /> Professional Stats
      </h3>
      <div className="grid grid-cols-1 gap-6">
        <Input
          type="number"
          name="yearOfExperience"
          value={formData.yearOfExperience}
          onChange={handleChange}
          label={
            <span className="flex items-center gap-2">
              <FaBriefcase className="text-muted-foreground" /> Experience
              (Years)
            </span>
          }
        />
        <Input
          type="number"
          name="projectsCompleted"
          value={formData.projectsCompleted}
          onChange={handleChange}
          label={
            <span className="flex items-center gap-2">
              <FaProjectDiagram className="text-muted-foreground" /> Projects
              Completed
            </span>
          }
        />
        <Input
          type="number"
          name="happyClients"
          value={formData.happyClients}
          onChange={handleChange}
          label={
            <span className="flex items-center gap-2">
              <FaSmile className="text-muted-foreground" /> Happy Clients
            </span>
          }
        />
      </div>
    </Card>
  );
};

export default UserStats;
