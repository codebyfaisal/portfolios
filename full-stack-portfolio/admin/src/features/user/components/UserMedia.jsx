import React, { useState } from "react";
import { Button, FilePickerModal, Card } from "@/components";
import toast from "react-hot-toast";
import {
  FaCamera,
  FaBriefcase,
  FaVideo,
  FaFilePdf,
  FaTrash,
} from "react-icons/fa";

const UserMedia = ({ formData, setFormData, className, isLoading }) => {
  const [pickerState, setPickerState] = useState({
    isOpen: false,
    type: "images",
    target: null,
  });

  const handleOpenPicker = (type, target) =>
    setPickerState({ isOpen: true, type, target });

  const handleSelect = (url) => {
    if (pickerState.target === "resume") {
      setFormData((prev) => ({ ...prev, resume: url }));
      toast.success("Resume selected! Remember to save changes.");
    } else if (pickerState.target === "introVideo") {
      setFormData((prev) => ({ ...prev, introVideo: url }));
      toast.success("Video selected! Remember to save changes.");
    } else if (pickerState.target === "avatar") {
      setFormData((prev) => ({ ...prev, avatar: url }));
      toast.success("Avatar updated! Remember to save changes.");
    }
  };

  const handleRemove = (target) => {
    if (confirm(`Remove ${target}?`)) {
      if (target === "resume") setFormData((prev) => ({ ...prev, resume: "" }));
      else if (target === "introVideo")
        setFormData((prev) => ({ ...prev, introVideo: "" }));
      else if (target === "avatar")
        setFormData((prev) => ({ ...prev, avatar: "" }));
    }
  };

  return (
    <Card className={className}>
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <FaCamera className="text-primary" /> Media & Attachments
      </h3>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 gap-8">
        {/* Avatar */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-foreground">Avatar</h4>
            {formData.avatar && (
              <button
                type="button"
                onClick={() => handleRemove("avatar")}
                className="font-bold text-xs text-destructive hover:text-destructive/80"
              >
                Remove
              </button>
            )}
          </div>

          <div className="max-w-40 max-h-40 mx-auto lg:mx-0">
            {formData.avatar ? (
              <div className="relative group w-40 h-40">
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-border"
                />
                <div
                  className="absolute inset-0 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  onClick={() => handleOpenPicker("images", "avatar")}
                >
                  <span className="text-xs font-bold text-foreground bg-background/80 px-2 py-1 rounded">
                    Change
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => handleOpenPicker("images", "avatar")}
                className="w-40 h-40 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/30 transition-all text-muted-foreground hover:text-primary"
              >
                <FaCamera size={24} className="mb-2" />
                <span className="text-xs">Upload Photo</span>
              </div>
            )}
          </div>
        </div>

        {/* Intro Video */}
        <div className="space-y-4 flex flex-col">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-foreground">Intro Video</h4>
            {formData.introVideo && (
              <button
                type="button"
                onClick={() => handleRemove("introVideo")}
                className="text-xs text-destructive hover:text-destructive/80"
              >
                Remove
              </button>
            )}
          </div>

          {!formData.introVideo ? (
            <Card
              className="space-y-4 flex flex-col items-center justify-center min-h-30 flex-1"
              rounded="rounded-lg"
            >
              <p className="text-sm text-muted-foreground mb-3">
                Select a video from File Manager
              </p>
              <Button
                onClick={() => handleOpenPicker("video", "introVideo")}
                label="Select Video"
                uiType="secondary"
                icon={<FaVideo />}
              />
            </Card>
          ) : (
            <Card
              className="relative aspect-video overflow-hidden flex-1"
              padding="p-0"
            >
              <video
                src={formData.introVideo}
                controls
                className="w-full h-full object-contain"
              />
            </Card>
          )}
        </div>

        {/* Resume */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Resume (PDF)</h4>
          {formData.resume ? (
            <Card
              className="bg-muted/20 flex items-center justify-between"
              padding="p-4"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-destructive/20 p-2 rounded-lg text-destructive">
                  <FaBriefcase size={18} />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-foreground truncate">
                    {formData.resume.split("/").pop()}
                  </p>
                  <a
                    href={formData.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    View File
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove("resume")}
                className="text-muted-foreground hover:text-destructive p-2"
              >
                <FaTrash />
              </button>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center text-center hover:border-primary transition-colors bg-muted/20 min-h-30">
              <p className="text-sm text-muted-foreground mb-3">
                Select your resume (PDF)
              </p>
              <Button
                onClick={() => handleOpenPicker("raw", "resume")}
                label="Select PDF"
                uiType="primary"
                icon={<FaFilePdf />}
                size="sm"
              />
            </Card>
          )}
        </div>
      </div>

      <FilePickerModal
        isOpen={pickerState.isOpen}
        onClose={() => setPickerState((prev) => ({ ...prev, isOpen: false }))}
        onSelect={handleSelect}
        resourceType={pickerState.type}
      />
    </Card>
  );
};

export default UserMedia;
