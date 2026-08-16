import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Button, Card } from "@/components";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, title, small = false, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        <Card
          className={cn(
            "w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl",
            small ? "max-w-md" : "max-w-3xl"
          )}
          padding="p-0"
        >
          <div className="flex justify-between items-center border-b border-border sticky top-0 z-10 bg-card">
            <h2 className="text-xl font-bold text-foreground px-6 py-4 capitalize">
              {title}
            </h2>
            <Button
              onClick={onClose}
              uiType="text"
              icon={<FaTimes size={12} />}
              label="Close"
              className="mr-4"
            />
          </div>
          <div className="px-6 py-4">{children}</div>
        </Card>
      </motion.div>
    </>
  );
};

export default Modal;
