import React from "react";
import {
  FaCopy,
  FaTrash,
  FaFilePdf,
  FaVideo,
  FaImage,
  FaEye,
  FaPlay,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { Card } from "@/components";

import useCopy from "@/hooks/useCopy";

const FileItem = ({ file, onDelete, onClick, onSelect, isModal }) => {
  const isImage = file.resource_type === "image" && file.format !== "pdf";
  const isVideo = file.resource_type === "video";
  const isPdf = file.format === "pdf";
  const { copy } = useCopy();

  const handleCopyLink = (e) => {
    e.stopPropagation();
    copy(file.secure_url, null, "Link copied to clipboard!");
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(file.public_id);
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    onClick({ url: file.secure_url, type: file.resource_type });
  };

  return (
    <Card
      padding="p-0"
      className={`group relative overflow-hidden hover:border-primary transition-all ${
        onSelect ? "cursor-pointer hover:border-primary" : ""
      }`}
      onClick={() => onSelect && onSelect(file)}
    >
      <div className="aspect-square w-full bg-muted/20 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img
            src={file.secure_url}
            alt={file.public_id}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        ) : isVideo ? (
          <div className="text-muted-foreground flex flex-col items-center">
            <FaVideo size={48} />
            <span className="mt-2 text-xs">Video</span>
          </div>
        ) : isPdf ? (
          <div className="text-red-500 flex flex-col items-center">
            <FaFilePdf size={48} />
            <span className="mt-2 text-xs">PDF</span>
          </div>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center">
            <FaImage size={48} />
            <span className="mt-2 text-xs">File</span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onSelect ? (
            <span className="text-primary-foreground text-xs font-bold bg-primary px-3 py-1.5 rounded-lg shadow-lg transform scale-95 group-hover:scale-100 transition-transform">
              Select
            </span>
          ) : (
            <>
              <button
                onClick={handleCopyLink}
                className="p-2 bg-muted hover:bg-muted/80 text-foreground rounded-full backdrop-blur-sm transition-colors"
                title="Copy Link"
              >
                <FaCopy />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-full backdrop-blur-sm transition-colors"
                title="Delete"
              >
                <FaTrash />
              </button>
              {(isImage || isVideo) && (
                <button
                  onClick={handlePreview}
                  className="p-2 bg-muted hover:bg-muted/80 text-foreground rounded-full backdrop-blur-sm transition-colors"
                  title="Preview"
                >
                  {isVideo ? <FaPlay /> : <FaEye />}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <Card className="border-0 border-t" padding="p-3" rounded="rounded-0">
        <p
          className="text-xs text-muted-foreground truncate font-mono"
          title={file.public_id}
        >
          {file.public_id.split("/").pop()}
        </p>
        <div className="flex justify-between items-center mt-2 text-[10px] text-muted-foreground">
          <span className="uppercase">{file.format}</span>
          <span>{(file.bytes / 1024).toFixed(0)} KB</span>
        </div>
      </Card>
    </Card>
  );
};

export default FileItem;
