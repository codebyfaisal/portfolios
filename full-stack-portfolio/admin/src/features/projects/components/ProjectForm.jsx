import React, { useState, useEffect, useMemo } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import {
  Modal,
  Input,
  Textarea,
  Button,
  ConfirmationModal,
} from "@/components";
import { FileManager } from "@/pages";
import useDashboardStore from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const ProjectForm = ({ isOpen, onClose, projectToEdit }) => {
  const { addProject, updateProject } = useDashboardStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    date: {
      start: "",
      end: "",
      ongoing: false,
    },
    techStack: "",
    githubLink: "",
    liveLink: "",
    features: "",
    featured: false,
  });

  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null,
  });

  useEffect(() => {
    let initialData;
    if (projectToEdit) {
      initialData = {
        title: projectToEdit.title || "",
        description: projectToEdit.description || "",
        images: Array.isArray(projectToEdit.images)
          ? projectToEdit.images
          : projectToEdit.images
          ? [projectToEdit.images]
          : [],
        date: {
          start: projectToEdit.date?.start
            ? projectToEdit.date.start.split("T")[0]
            : "",
          end: projectToEdit.date?.end
            ? projectToEdit.date.end.split("T")[0]
            : "",
          ongoing: projectToEdit.date?.ongoing || false,
        },
        techStack: projectToEdit.techStack?.join(", ") || "",
        githubLink: projectToEdit.githubLink || "",
        liveLink: projectToEdit.liveLink || "",
        features: projectToEdit?.features?.join(", ") || "",
        featured: projectToEdit.featured || false,
      };
    } else {
      initialData = {
        title: "",
        description: "",
        images: [],
        date: {
          start: "",
          end: "",
          ongoing: false,
        },
        techStack: "",
        githubLink: "",
        liveLink: "",
        features: "",
        featured: false,
      };
    }
    setFormData(initialData);
    setInitialFormData(initialData);
  }, [projectToEdit, isOpen]);

  const isModalDirty = useMemo(() => {
    if (!initialFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  const handleClose = (force = false) => {
    if (!force && isModalDirty) {
      setConfirmState({
        isOpen: true,
        type: "discard",
      });
      return;
    }
    onClose();
  };

  const handleFileSelect = (file) => {
    const url = file.secure_url || file.url || file;
    if (!formData.images.includes(url)) {
      setFormData({ ...formData, images: [...formData.images, url] });
    }
    setIsFileManagerOpen(false);
  };

  const removeImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isModalDirty) return;
    setIsSubmitting(true);
    const projectData = {
      ...formData,
      techStack: formData.techStack
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      features: formData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
    };

    try {
      if (projectToEdit) {
        await updateProject(projectToEdit._id, projectData);
        toast.success("Project updated successfully!");
      } else {
        await addProject(projectData);
        toast.success("Project created successfully!");
      }
      handleClose(true);
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error(error?.response?.data?.message || "Failed to save project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setConfirmState({ isOpen: false });
    handleClose(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => handleClose(false)}
        title={projectToEdit ? "Edit Project" : "Add New Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <Input
              label="Start Date"
              type="date"
              value={formData.date.start}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: { ...formData.date, start: e.target.value },
                })
              }
              required
            />
            <div className="flex items-end gap-2">
              {!formData.date.ongoing && (
                <Input
                  label="End Date"
                  type="date"
                  value={formData.date.end}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: { ...formData.date, end: e.target.value },
                    })
                  }
                  required={!formData.date.ongoing}
                  className="flex-1"
                />
              )}
              <div className="flex items-center gap-2 h-10 pb-3">
                <input
                  type="checkbox"
                  id="ongoing"
                  checked={formData.date.ongoing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: { ...formData.date, ongoing: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-ring"
                />
                <label
                  htmlFor="ongoing"
                  className="text-sm font-medium text-muted-foreground whitespace-nowrap"
                >
                  Ongoing
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Project Images
              </label>
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-lg overflow-hidden group border border-border"
                  >
                    <img
                      src={img}
                      alt={`Project ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-destructive/80 text-destructive-foreground p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setIsFileManagerOpen(true)}
                  className="flex flex-col items-center justify-center aspect-video bg-muted/50 border border-dashed border-border rounded-lg hover:bg-muted hover:border-primary transition-colors"
                >
                  <FaPlus className="text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">
                    Add Image
                  </span>
                </button>
              </div>
            </div>
          </div>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows={5}
          />

          <Input
            label="Tech Stack (comma separated)"
            value={formData.techStack}
            onChange={(e) =>
              setFormData({ ...formData, techStack: e.target.value })
            }
            placeholder="React, Node.js, Tailwind"
          />

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Repository URL"
              value={formData.githubLink}
              onChange={(e) =>
                setFormData({ ...formData, githubLink: e.target.value })
              }
            />
            <Input
              label="Live Demo URL"
              value={formData.liveLink}
              onChange={(e) =>
                setFormData({ ...formData, liveLink: e.target.value })
              }
            />
          </div>
          <Textarea
            label="Key Features (comma separated)"
            value={formData.features}
            onChange={(e) =>
              setFormData({ ...formData, features: e.target.value })
            }
            placeholder="Feature 1, Feature 2, Feature 3"
            rows={4}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-ring"
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium text-muted-foreground"
            >
              Featured Project
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              onClick={() => handleClose(false)}
              uiType="text"
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors w-auto"
              label="Cancel"
            />
            <Button
              uiType="primary"
              type="submit"
              disabled={isSubmitting || !isModalDirty}
              loading={isSubmitting}
              className={`bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors w-auto ${
                !isModalDirty && !isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              label={
                isSubmitting
                  ? "Saving..."
                  : projectToEdit
                  ? "Update Project"
                  : "Create Project"
              }
            />
          </div>
        </form>
      </Modal>

      {/* File Manager Modal */}
      <Modal
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        title="Select Project Image"
      >
        <div className="h-[70vh] overflow-y-auto">
          <FileManager
            isModal={true}
            resType="images"
            onSelect={handleFileSelect}
          />
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, type: null })}
        onConfirm={handleDiscard}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to discard them and close?"
        confirmText="Discard"
        isDangerous={true}
      />
    </>
  );
};

export default ProjectForm;
