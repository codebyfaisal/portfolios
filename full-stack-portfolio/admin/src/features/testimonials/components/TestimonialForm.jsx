import React, { useState, useEffect, useMemo } from "react";
import { FaSave } from "react-icons/fa";
import {
  Modal,
  Input,
  Textarea,
  Button,
  ConfirmationModal,
  Select,
} from "@/components";
import { FileManager } from "@/pages";
import useDashboardStore from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const TestimonialForm = ({ isOpen, onClose, testimonialToEdit }) => {
  const { addTestimonial, updateTestimonial } = useDashboardStore();

  const initialFormState = {
    name: "",
    role: "",
    text: "",
    avatar: "",
    hasVideo: false,
    videoType: "iframe",
    videoUrl: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null,
  });

  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [fileManagerTarget, setFileManagerTarget] = useState("avatar");

  useEffect(() => {
    let initial;
    if (testimonialToEdit) {
      initial = {
        name: testimonialToEdit.name || "",
        role: testimonialToEdit.role || "",
        text: testimonialToEdit.text || "",
        avatar: testimonialToEdit.avatar || "",
        hasVideo: testimonialToEdit.hasVideo || !!testimonialToEdit.video,
        videoType: testimonialToEdit.videoType || "iframe",
        videoUrl: testimonialToEdit.videoUrl || testimonialToEdit.video || "",
      };
      setFormData(initial);
    } else {
      initial = initialFormState;
      setFormData(initial);
    }
    setInitialData(initial);
  }, [testimonialToEdit, isOpen]);

  const isModalDirty = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

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

  const openFileManager = (target) => {
    setFileManagerTarget(target);
    setIsFileManagerOpen(true);
  };

  const handleFileSelect = (file) => {
    if (fileManagerTarget === "avatar") {
      setFormData({ ...formData, avatar: file.url });
    } else if (fileManagerTarget === "video") {
      setFormData({ ...formData, videoUrl: file.url });
    }
    setIsFileManagerOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isModalDirty) return;

    setIsSubmitting(true);
    try {
      if (testimonialToEdit) {
        await updateTestimonial(testimonialToEdit._id, formData);
        toast.success("Testimonial updated successfully!");
      } else {
        await addTestimonial(formData);
        toast.success("Testimonial created successfully!");
      }
      handleClose(true);
    } catch (error) {
      console.error("Failed to save testimonial:", error);
      toast.error(error.message || "Failed to save testimonial.");
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
        title={testimonialToEdit ? "Edit Testimonial" : "Add New Testimonial"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Client Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Role / Company"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            />
          </div>

          <Textarea
            label="Testimonial Text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            rows={4}
            required
          />

          <div className="flex gap-2 items-end">
            <Input
              label="Avatar URL"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
              placeholder="https://..."
              className="flex-1"
            />
            <Button
              onClick={() => openFileManager("avatar")}
              uiType="secondary"
              label="Select Image"
              type="button"
              className="mb-px"
            />
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="hasVideo"
                checked={formData.hasVideo}
                onChange={(e) =>
                  setFormData({ ...formData, hasVideo: e.target.checked })
                }
              />
              <label htmlFor="hasVideo">Include Video Testimonial</label>
            </div>

            {formData.hasVideo && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label>Video Source Type</label>
                  <div className="grid grid-cols-3 gap-2 bg-background p-1 rounded-lg border border-border">
                    <Button
                      onClick={() =>
                        setFormData({ ...formData, videoType: "iframe" })
                      }
                      uiType={
                        formData.videoType === "iframe" ? "secondary" : "text"
                      }
                      label="Embed"
                      type="button"
                    />
                    <Button
                      onClick={() =>
                        setFormData({ ...formData, videoType: "video" })
                      }
                      uiType={
                        formData.videoType === "video" ? "secondary" : "text"
                      }
                      label="Direct Link"
                      type="button"
                    />
                    <Button
                      onClick={() =>
                        setFormData({ ...formData, videoType: "file" })
                      }
                      uiType={
                        formData.videoType === "file" ? "secondary" : "text"
                      }
                      label="File Manager"
                      type="button"
                    />
                  </div>
                </div>

                {formData.videoType === "file" ? (
                  <div className="flex gap-2 items-end">
                    <Input
                      label="Selected Video URL"
                      value={formData.videoUrl}
                      readOnly
                      placeholder="Select a video file..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => openFileManager("video")}
                      uiType="secondary"
                      label="Select Video"
                      type="button"
                      className="mb-px"
                    />
                  </div>
                ) : (
                  <Input
                    label={
                      formData.videoType === "iframe"
                        ? "Embed URL (src)"
                        : "Video File URL"
                    }
                    value={formData.videoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrl: e.target.value })
                    }
                    placeholder={
                      formData.videoType === "iframe"
                        ? "https://www.youtube.com/embed/..."
                        : "https://example.com/video.mp4"
                    }
                  />
                )}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 pb-2">
            <Button
              onClick={() => handleClose(false)}
              uiType="text"
              label="Cancel"
              type="button"
            />
            <Button
              uiType="primary"
              type="submit"
              disabled={isSubmitting || !isModalDirty}
              loading={isSubmitting}
              icon={<FaSave />}
              className={`bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors w-auto ${
                !isModalDirty && !isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              label={
                isSubmitting
                  ? "Saving..."
                  : testimonialToEdit
                  ? "Update"
                  : "Create"
              }
            />
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, type: null })}
        onConfirm={handleDiscard}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
        isDangerous={true}
      />

      {/* File Manager Modal */}
      <Modal
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        title={
          fileManagerTarget === "avatar" ? "Select Avatar" : "Select Video"
        }
      >
        <div className="h-[70vh] overflow-y-auto">
          <FileManager
            isModal={true}
            resType={fileManagerTarget === "avatar" ? "images" : "videos"}
            onSelect={handleFileSelect}
          />
        </div>
      </Modal>
    </>
  );
};

export default TestimonialForm;
