import React, { useEffect, useState } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { FaCloudUploadAlt, FaSync } from "react-icons/fa";
import { Button, Modal, PageHeader } from "@/components";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import FileGrid from "./components/FileGrid";

const UploadBtn = ({ loading, uploading, handleFileUpload, loadMedia }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => loadMedia(true)}
        icon={<FaSync className={loading ? "animate-spin" : ""} />}
        uiType="secondary"
        disabled={loading || uploading}
        className="file-manager-reload-btn pt-3 pb-2.5 sm:py-3 cursor-pointer"
        title="Refresh files"
      />

      <div className="relative overflow-hidden">
        <Button
          label={uploading ? "Uploading..." : "Upload File"}
          icon={
            <FaCloudUploadAlt
              size={18}
              className={uploading ? "animate-bounce" : ""}
            />
          }
          uiType="primary"
          disabled={uploading || loading}
          className="cursor-pointer"
        />
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileUpload}
          disabled={uploading || loading}
        />
      </div>
    </div>
  );
};

const FileManager = ({ isModal = false, resType = "all", onSelect }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchFiles, deleteFile, uploadFile } = useDashboardStore();
  const [files, setFiles] = useState([]);
  const [resourceType, setResourceType] = useState(
    searchParams.get("resourceType") || resType,
  );
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState({ url: null, type: null });

  const loadMedia = async (reset = false, cursor = null) => {
    if (!isModal) {
      searchParams.set("resourceType", resourceType);
      setSearchParams(searchParams);
    }
    setLoading(true);
    try {
      const data = await fetchFiles(resourceType, cursor);
      if (reset) setFiles(data.resources || []);
      else setFiles((prev) => [...prev, ...(data.resources || [])]);
      setNextCursor(data.next_cursor);
    } catch (error) {
      console.error("Error loading media:", error);
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFiles([]);
    setNextCursor(null);
    loadMedia(true);
  }, [resourceType]);

  const handleDelete = async (publicId) => {
    if (uploading || loading) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this file? This cannot be undone.",
      )
    )
      return;

    try {
      await deleteFile(publicId);
      setFiles((prev) => prev.filter((f) => f.public_id !== publicId));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error?.response?.data?.message || "Failed to delete file");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File Upload Security Validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB Limit
    const DANGEROUS_EXTENSIONS = [
      "exe",
      "bat",
      "cmd",
      "sh",
      "php",
      "js",
      "py",
      "dll",
      "msi",
      "vbs",
      "ps1",
      "jar",
      "asp",
      "aspx",
    ];

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (DANGEROUS_EXTENSIONS.includes(fileExtension)) {
      toast.error(
        `Security Warning: Files with extension .${fileExtension} are not allowed.`,
      );
      e.target.value = null;
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `File size exceeds max limit of 10MB (${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
      );
      e.target.value = null;
      return;
    }

    setUploading(true);
    try {
      const newMedia = await uploadFile(file);
      toast.success("File uploaded successfully");

      if (newMedia && newMedia.public_id) {
        const formattedMedia = {
          ...newMedia,
          url: newMedia.secure_url || newMedia.url,
        };
        setFiles((prev) => [
          formattedMedia,
          ...prev.filter((f) => f.public_id !== formattedMedia.public_id),
        ]);
      } else {
        await loadMedia(true);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handlePreview = ({ url, type }) => {
    setOpenModal(true);
    setPreview({ url, type });
  };

  return (
    <div className="relative">
      {!isModal && (
        <header className="mb-6">
          <PageHeader
            title="File Manager"
            description="Manage your cloud assets (images, videos, PDFs)."
            children={
              <UploadBtn
                loading={loading}
                uploading={uploading}
                handleFileUpload={handleFileUpload}
                loadMedia={loadMedia}
              />
            }
          />
        </header>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "images", "videos", "PDF", "others"].map((type) =>
            isModal && type === "others" ? null : (
              <button
                type="button"
                key={type}
                disabled={loading || uploading}
                onClick={() => {
                  if (!isModal) {
                    searchParams.set("resourceType", type);
                    setSearchParams(searchParams);
                  }
                  setResourceType(type);
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize cursor-pointer",
                  resourceType === type
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  (loading || uploading) && "opacity-50 cursor-not-allowed",
                )}
              >
                {type}
              </button>
            ),
          )}
        </div>

        {isModal && (
          <UploadBtn
            loading={loading}
            uploading={uploading}
            handleFileUpload={handleFileUpload}
            loadMedia={loadMedia}
          />
        )}
      </div>

      <div
        className={cn(
          "relative transition-all duration-300",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        {uploading && (
          <div className="absolute inset-0 z-30 bg-background/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3 rounded-xl border border-border/50 p-6 min-h-[250px]">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Uploading file...
              </p>
              <p className="text-xs text-muted-foreground">
                Please wait while your media is uploaded & processed.
              </p>
            </div>
          </div>
        )}

        <FileGrid
          files={files}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onSelect={onSelect}
          isModal={isModal}
          loading={loading && !nextCursor}
          emptyMessage={
            resourceType === "all"
              ? "No files uploaded yet."
              : `No ${resourceType} files found.`
          }
        />

        {/* Load More */}
        {nextCursor && (
          <div className="flex justify-center pt-8 pb-4">
            <Button
              label="Load More"
              onClick={() => loadMedia(false, nextCursor)}
              uiType="secondary"
              disabled={loading || uploading}
            />
          </div>
        )}
      </div>

      <Modal
        title="Preview Media"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        {preview.type === "video" ? (
          <video
            src={preview.url}
            controls
            className="w-full h-[60vh] object-contain rounded-lg"
          ></video>
        ) : (
          <img
            src={preview.url}
            alt="Preview"
            className="w-full h-[60vh] object-contain rounded-lg"
          />
        )}
      </Modal>
    </div>
  );
};

export default FileManager;
