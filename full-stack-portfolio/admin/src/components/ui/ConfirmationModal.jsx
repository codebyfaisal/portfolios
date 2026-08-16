import React from "react";
import { Modal, Button } from "@/components";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} small={true}>
      <div className="space-y-6">
        <p className="text-muted-foreground">{message}</p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onCancel || onClose}
            uiType="text"
            label={cancelText}
          />
          <Button
            onClick={onConfirm}
            uiType={isDangerous ? "danger" : "primary"}
            label={confirmText}
            className={
              isDangerous
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : ""
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
