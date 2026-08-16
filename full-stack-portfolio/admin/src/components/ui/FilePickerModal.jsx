import React from "react";
import { Modal } from "@/components";
import { FileManager } from "@/pages";

const FilePickerModal = ({
  isOpen,
  onClose,
  onSelect,
  resourceType = "images",
}) => {
  const handleSelect = (file) => {
    if (onSelect) onSelect(file.secure_url);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select File">
      <FileManager isModal resType={resourceType} onSelect={handleSelect} />
    </Modal>
  );
};

export default FilePickerModal;
