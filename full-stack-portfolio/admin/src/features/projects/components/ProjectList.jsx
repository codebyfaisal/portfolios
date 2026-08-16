import React from "react";
import { FaEdit, FaTrash, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { Button, Card } from "@/components";
import { motion } from "motion/react";

const ProjectList = ({ projects, onEdit, onDelete }) => {
  return projects.map((project, index) => (
    <Card
      key={index}
      className="overflow-hidden group w-full max-w-md md:max-w-full mx-auto md:mx-0"
      padding="p-0"
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="h-full flex flex-col"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              project.images && project.images.length > 0
                ? project.images[0]
                : null
            }
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <Button
              onClick={() => onEdit(project)}
              uiType="primary"
              icon={<FaEdit size={12} />}
              label="Edit"
            />
            <Button
              onClick={() => onDelete(project._id)}
              uiType="danger"
              icon={<FaTrash size={12} />}
              label="Delete"
            />
          </div>
          {project.featured && (
            <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full border border-yellow-500/20 backdrop-blur-md">
              FEATURED
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {(project.techStack || []).map((tech, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-md bg-muted text-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border-t border-border">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <FaGithub /> Code
            </a>
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <FaExternalLinkAlt /> Live Demo
            </a>
          </div>
        </div>
      </motion.div>
    </Card>
  ));
};

export default ProjectList;
