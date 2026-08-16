import React, { useState, useEffect, useMemo } from "react";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";
import {
  Modal,
  Input,
  Textarea,
  Button,
  ConfirmationModal,
  Select,
  QuestionBuilder,
} from "@/components";
import useDashboardStore from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const JobForm = ({ isOpen, onClose, jobToEdit }) => {
  const { addJob, updateJob } = useDashboardStore();

  const initialFormState = {
    title: "",
    type: "Full-time",
    location: "Remote",
    description: "",
    requirements: [],
    salary: { min: "", max: "", currency: "USD" },
    status: "Open",
    lastDate: "",
    questions: [],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null,
  });

  useEffect(() => {
    let initial;
    if (jobToEdit) {
      initial = {
        title: jobToEdit.title || "",
        type: jobToEdit.type || "Full-time",
        location: jobToEdit.location || "Remote",
        description: jobToEdit.description || "",
        requirements: jobToEdit.requirements || [],
        salary: jobToEdit.salary || { min: "", max: "", currency: "USD" },
        status: jobToEdit.status || "Open",
        lastDate: jobToEdit.lastDate
          ? new Date(jobToEdit.lastDate).toISOString().split("T")[0]
          : "",
        questions: jobToEdit.form?.questions || [],
      };
      setFormData(initial);
    } else {
      initial = initialFormState;
      setFormData(initial);
    }
    setInitialData(initial);
  }, [jobToEdit, isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isModalDirty) return;

    if (!formData.title || !formData.description) {
      toast.error("Title and Description are required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (jobToEdit) {
        await updateJob(jobToEdit._id, formData);
        toast.success("Job updated successfully!");
      } else {
        await addJob(formData);
        toast.success("Job created successfully!");
      }
      handleClose(true);
    } catch (error) {
      toast.error(error.message || "Failed to save job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setConfirmState({ isOpen: false });
    handleClose(true);
  };

  const handleChange = (e) => {
    if (e.target.name === "lastDate") {
      const date = new Date(e.target.value);
      setFormData({ ...formData, lastDate: date });
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => handleClose(false)}
        title={jobToEdit ? "Edit Job" : "Post New Job"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Job Details
            </h3>
            <Input
              label="Job Title"
              value={formData.title}
              onChange={handleChange}
              name="title"
              required
              placeholder="e.g. Senior React Developer"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  label="Type"
                  value={formData.type}
                  onChange={handleChange}
                  name="type"
                  options={[
                    { value: "Full-time", label: "Full-time" },
                    { value: "Part-time", label: "Part-time" },
                    { value: "Contract", label: "Contract" },
                  ]}
                  required
                  placeholder="Select Type"
                />
              </div>
              <div>
                <Select
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  options={[
                    { value: "Remote", label: "Remote" },
                    { value: "On-site", label: "On-site" },
                  ]}
                  required
                  placeholder="Select Location"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Min Salary"
                type="number"
                value={formData.salary.min}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary: { ...formData.salary, min: e.target.value },
                  })
                }
                placeholder="Min"
                required
              />
              <Input
                label="Max Salary"
                type="number"
                value={formData.salary.max}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary: { ...formData.salary, max: e.target.value },
                  })
                }
                placeholder="Max"
                required
              />
              <Select
                label="Currency"
                value={formData.salary.currency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary: { ...formData.salary, currency: e.target.value },
                  })
                }
                options={[
                  { value: "$", label: "USD ($)" },
                  { value: "€", label: "EUR (€)" },
                  { value: "£", label: "GBP (£)" },
                  { value: "Rs", label: "PKR (Rs)" },
                ]}
                required
                placeholder="Currency"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={handleChange}
                  name="status"
                  options={[
                    { value: "Open", label: "Open" },
                    { value: "Closed", label: "Closed" },
                  ]}
                  required
                  placeholder="e.g. Open"
                />
              </div>
              <div>
                <Input
                  label="Last Date to Apply"
                  type="date"
                  name="lastDate"
                  value={formData.lastDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Textarea
              label="Description"
              value={formData.description}
              onChange={handleChange}
              name="description"
              required
              placeholder="Job description..."
              rows={6}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="text-lg font-semibold text-foreground">
                Requirements
              </h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    requirements: [...formData.requirements, ""],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={14} />}
                label="Add Requirement"
                type="button"
                style={{ padding: "0.5rem 1rem" }}
              />
            </div>
            <div className="space-y-2">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={req}
                    onChange={(e) => {
                      const newReqs = [...formData.requirements];
                      newReqs[index] = e.target.value;
                      setFormData({ ...formData, requirements: newReqs });
                    }}
                    placeholder={`Requirement ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      const newReqs = formData.requirements.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, requirements: newReqs });
                    }}
                    uiType="secondary"
                    icon={<FaTrash size={12} />}
                    className="hover:text-destructive"
                    type="button"
                  />
                </div>
              ))}
            </div>
          </div>

          <QuestionBuilder
            questions={formData.questions}
            onChange={(newQuestions) =>
              setFormData({ ...formData, questions: newQuestions })
            }
          />

          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 pb-4 bg-background/95 backdrop-blur-sm border-t border-border mt-6">
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
              icon={<FaSave size={12} />}
              label={
                isSubmitting
                  ? "Saving..."
                  : jobToEdit
                    ? "Update Job"
                    : "Post Job"
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
    </>
  );
};

export default JobForm;
