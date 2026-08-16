import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useDashboardStore from "@/store/useDashboardStore";
import {
  FaPlus,
  FaFilter,
  FaTimes,
  FaSearch,
  FaProjectDiagram,
} from "react-icons/fa";
import {
  Button,
  ConfirmationModal,
  PageHeader,
  RightSidebar,
  Input,
  NotFound,
} from "@/components";
import ProjectSkeleton from "./components/ProjectSkeleton";
import toast from "react-hot-toast";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/ProjectForm";

const Projects = () => {
  const [searchParams] = useSearchParams();
  const projects = useDashboardStore((state) => state.projects);
  const fetchProjects = useDashboardStore((state) => state.fetchProjects);
  const deleteProject = useDashboardStore((state) => state.deleteProject);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const resetProjectState = useDashboardStore((state) => state.resetProjectState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    techStack: "",
  });

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    fetchProjects();
    return () => resetProjectState();
  }, [fetchProjects, resetProjectState]);

  useEffect(() => {
    if (searchParams.get("new")) setIsModalOpen(true);
  }, [searchParams]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter((project) => {
      const matchesSearch = project.title
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchesTech =
        filters.techStack === "" ||
        (Array.isArray(project.techStack)
          ? project.techStack.some((tech) =>
              tech.toLowerCase().includes(filters.techStack.toLowerCase())
            )
          : project.techStack
              ?.toLowerCase()
              .includes(filters.techStack.toLowerCase()));

      return matchesSearch && matchesTech;
    });
  }, [projects, filters]);

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true,
      id: id,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProject(confirmState.id);
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete project."
      );
    } finally {
      setConfirmState({ isOpen: false, id: null });
    }
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects."
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(true)}
            uiType="secondary"
            icon={<FaFilter />}
            label="Filters"
          />
          <Button
            onClick={() => handleOpenModal(null)}
            uiType="primary"
            icon={<FaPlus size={14} />}
            label="Add Project"
          />
        </div>
      </PageHeader>

      <div className="space-y-6">
        {!isLoading && (!projects || projects.length === 0) ? (
          <NotFound
            Icon={FaProjectDiagram}
            message="No projects created yet."
          />
        ) : !isLoading && (!filteredProjects || filteredProjects.length === 0) ? (
          <NotFound
            Icon={FaProjectDiagram}
            message="No projects found matching your criteria."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              <ProjectSkeleton />
            ) : (
              <ProjectList
                projects={filteredProjects}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProjectForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectToEdit={editingProject}
        />
      )}

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Project?"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />

      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Projects"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={() => setFilters({ search: "", techStack: "" })}
              label="Reset"
              uiType="secondary"
              className="w-full"
              icon={<FaTimes />}
            />
            <Button
              onClick={() => setShowFilters(false)}
              label="Done"
              uiType="primary"
              className="w-full"
            />
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Search Projects"
            placeholder="Search by title..."
            icon={<FaSearch />}
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
          <Input
            label="Tech Stack"
            placeholder="e.g. React, Node..."
            value={filters.techStack}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, techStack: e.target.value }))
            }
          />
          <div className="text-xs text-muted-foreground">
            <p>
              Filtering {filteredProjects.length} of {projects?.length || 0}{" "}
              projects
            </p>
          </div>
        </div>
      </RightSidebar>
    </div>
  );
};

export default Projects;
