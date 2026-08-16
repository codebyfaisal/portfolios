import React, { useState } from "react";
import { FaBriefcase, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Input, Button, Modal, Card } from "@/components";

const UserExperience = ({ formData, setFormData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [experienceForm, setExperienceForm] = useState({
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
  });

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setExperienceForm({
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index) => {
    const item = formData.experience[index];
    setEditingIndex(index);
    setExperienceForm({
      company: item.company || "",
      role: item.role || "",
      location: item.location || "",
      startDate: item.startDate
        ? new Date(item.startDate).toISOString().split("T")[0]
        : "",
      endDate: item.endDate
        ? new Date(item.endDate).toISOString().split("T")[0]
        : "",
      current: !!item.current,
    });
    setIsModalOpen(true);
  };

  const handleSaveExperience = (e) => {
    e.preventDefault();
    if (
      experienceForm.company &&
      experienceForm.role &&
      experienceForm.startDate &&
      (experienceForm.endDate || experienceForm.current)
    ) {
      if (editingIndex !== null) {
        setFormData((prev) => {
          const updated = [...prev.experience];
          updated[editingIndex] = { ...experienceForm };
          return { ...prev, experience: updated };
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          experience: [...prev.experience, { ...experienceForm }],
        }));
      }
      setIsModalOpen(false);
      setEditingIndex(null);
      setExperienceForm({
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
      });
    }
  };

  const handleRemoveExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FaBriefcase className="text-primary" /> Work Experience
        </h3>
        <Button
          onClick={handleOpenAdd}
          uiType="primary"
          icon={<FaPlus size={14} />}
          label="Add Experience"
        />
      </div>

      {/* List Experience */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {formData.experience.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No experience added yet.
          </p>
        ) : (
          formData.experience.map((exp, index) => (
            <Card
              key={index}
              className="bg-muted/30 relative group"
              padding="p-4"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1 w-max">
                <Button
                  onClick={() => handleOpenEdit(index)}
                  uiType="text"
                  icon={<FaEdit size={13} />}
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary w-auto p-2 pl-2.5"
                  title="Edit Experience"
                />
                <Button
                  onClick={() => handleRemoveExperience(index)}
                  uiType="text"
                  icon={<FaTrash size={12} />}
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 w-auto p-2"
                  title="Delete Experience"
                />
              </div>
              <h4 className="font-bold text-foreground">{exp.role}</h4>
              <p className="text-primary text-sm">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                {exp.startDate
                  ? new Date(exp.startDate).toLocaleDateString()
                  : ""}{" "}
                -{" "}
                {exp.current
                  ? "Present"
                  : exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString()
                    : ""}
              </p>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingIndex !== null ? "Edit Work Experience" : "Add Work Experience"
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              value={experienceForm.company}
              onChange={(e) =>
                setExperienceForm({
                  ...experienceForm,
                  company: e.target.value,
                })
              }
            />
            <Input
              label="Role"
              value={experienceForm.role}
              onChange={(e) =>
                setExperienceForm({
                  ...experienceForm,
                  role: e.target.value,
                })
              }
            />
            <Input
              label="Location"
              value={experienceForm.location}
              onChange={(e) =>
                setExperienceForm({
                  ...experienceForm,
                  location: e.target.value,
                })
              }
            />
            <Input
              label="Start Date"
              type="date"
              value={experienceForm.startDate}
              onChange={(e) =>
                setExperienceForm({
                  ...experienceForm,
                  startDate: e.target.value,
                })
              }
            />
            <Input
              label="End Date"
              type="date"
              value={experienceForm.endDate}
              onChange={(e) =>
                setExperienceForm({
                  ...experienceForm,
                  endDate: e.target.value,
                })
              }
              disabled={experienceForm.current}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentRole"
              checked={experienceForm.current}
              onChange={(e) =>
                setExperienceForm({
                  ...experienceForm,
                  current: e.target.checked,
                })
              }
              className="rounded border-border bg-muted text-primary focus:ring-primary"
            />
            <label
              htmlFor="currentRole"
              className="text-sm text-muted-foreground select-none cursor-pointer"
            >
              I currently work here
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => setIsModalOpen(false)}
              uiType="text"
              label="Cancel"
            />
            <Button
              onClick={handleSaveExperience}
              uiType="primary"
              label={
                editingIndex !== null
                  ? "Update Experience"
                  : "Add Work Experience"
              }
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default UserExperience;
