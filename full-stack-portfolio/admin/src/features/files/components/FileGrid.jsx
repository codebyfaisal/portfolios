import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import FileSkeleton from "./FileSkeleton";
import FileItem from "./FileItem";

const FileGrid = ({
  files,
  onDelete,
  onPreview,
  onSelect,
  isModal,
  loading,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 gap-4",
        isModal ? "lg:grid-cols-4" : "lg:grid-cols-5"
      )}
    >
      {loading ? (
        <FileSkeleton />
      ) : !files || files.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full flex items-center justify-center py-20 text-muted-foreground"
        >
          <p>{props.emptyMessage || "No files found."}</p>
        </motion.div>
      ) : (
        files.map((file) => (
          <FileItem
            key={file.public_id}
            file={file}
            onDelete={onDelete}
            onClick={onPreview}
            onSelect={onSelect}
            isModal
          />
        ))
      )}
    </motion.div>
  );
};

export default FileGrid;
