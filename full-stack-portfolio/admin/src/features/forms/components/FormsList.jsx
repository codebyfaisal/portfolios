import React from "react";
import { Button, Card } from "@/components";
import { FaEdit, FaLink, FaTrash } from "react-icons/fa";
import { motion } from "motion/react";

const FormsList = ({ forms, isFormActive, actions, copiedId }) => {
  const { copyLink, setFormToEdit, setIsModalOpen, setDeleteId } = actions;

  return forms.map((form, index) => {
    const active = isFormActive(form);
    return (
      <Card key={form._id} padding="">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="p-6">
            <h3 className="font-bold text-foreground text-lg">{form.title}</h3>
            <div className="flex gap-2 items-center">
              <span
                className={`inline-flex mt-2 items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                  active
                    ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10"
                    : "text-muted-foreground border-border bg-muted/50"
                }`}
              >
                {active ? "Active" : "Inactive"}
              </span>
              {form.expiryDate && (
                <span className="block mt-1 text-xs text-muted-foreground">
                  Expires: {new Date(form.expiryDate).toLocaleDateString()}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {form.description || "No description provided."}
            </p>
          </div>

          <div className="px-6 py-2 border-t border-border flex items-center justify-between">
            <Button
              onClick={() => copyLink(form._id)}
              uiType="action"
              icon={<FaLink />}
              label={copiedId === form._id ? "Copied!" : "Copy Link"}
              title="Copy Form Link"
            />
            <div>
              <Button
                onClick={() => {
                  setFormToEdit(form);
                  setIsModalOpen(true);
                }}
                uiType="action"
                icon={<FaEdit />}
                title="Edit Form"
              />
              <Button
                onClick={() => setDeleteId(form._id)}
                uiType="action"
                icon={<FaTrash />}
                title="Delete Form"
              />
            </div>
          </div>
        </motion.div>
      </Card>
    );
  });
};

export default FormsList;
