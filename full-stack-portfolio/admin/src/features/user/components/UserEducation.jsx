import React, { useState } from "react";
import { FaUser, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Input, Button, Modal, Card } from "@/components";

const UserEducation = ({ formData, setFormData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [educationForm, setEducationForm] = useState({
    institution: "",
    location: "",
    degree: "",
    startDate: "",
    endDate: "",
    current: false,
  });

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setEducationForm({
      institution: "",
      location: "",
      degree: "",
      startDate: "",
      endDate: "",
      current: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index) => {
    const item = formData.education[index];
    setEditingIndex(index);
    setEducationForm({
      institution: item.institution || "",
      location: item.location || "",
      degree: item.degree || "",
      startDate: item.startDate ? new Date(item.startDate).toISOString().split("T")[0] : "",
      endDate: item.endDate ? new Date(item.endDate).toISOString().split("T")[0] : "",
      current: !!item.current,
    });
    setIsModalOpen(true);
  };

  const handleSaveEducation = (e) => {
    e.preventDefault();
    if (
      educationForm.institution &&
      educationForm.location &&
      educationForm.degree &&
      educationForm.startDate &&
      (educationForm.endDate || educationForm.current)
    ) {
      if (editingIndex !== null) {
        setFormData((prev) => {
          const updated = [...prev.education];
          updated[editingIndex] = { ...educationForm };
          return { ...prev, education: updated };
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          education: [...prev.education, { ...educationForm }],
        }));
      }
      setIsModalOpen(false);
      setEditingIndex(null);
      setEducationForm({
        institution: "",
        location: "",
        degree: "",
        startDate: "",
        endDate: "",
        current: false,
      });
    }
  };

  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FaUser className="text-primary" /> Education
        </h3>
        <Button
          onClick={handleOpenAdd}
          uiType="primary"
          icon={<FaPlus size={14} />}
          label="Add Education"
        />
      </div>

      {/* List Education */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {formData.education.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No education added yet.
          </p>
        ) : (
          formData.education.map((edu, index) => (
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
                  title="Edit Education"
                />
                <Button
                  onClick={() => handleRemoveEducation(index)}
                  uiType="text"
                  icon={<FaTrash size={12} />}
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 w-auto p-2"
                  title="Delete Education"
                />
              </div>
              <h4 className="font-bold text-foreground">{edu.degree}</h4>
              <p className="text-primary text-sm">
                {edu.institution}, {edu.location}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : ""} -{" "}
                {edu.current
                  ? "Present"
                  : edu.endDate ? new Date(edu.endDate).toLocaleDateString() : ""}
              </p>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndex !== null ? "Edit Education" : "Add Education"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Institution"
              value={educationForm.institution}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  institution: e.target.value,
                })
              }
            />
            <Input
              label="Location"
              value={educationForm.location}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  location: e.target.value,
                })
              }
            />
            <Input
              label="Degree"
              value={educationForm.degree}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  degree: e.target.value,
                })
              }
            />
            <Input
              label="Start Date"
              type="date"
              value={educationForm.startDate}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  startDate: e.target.value,
                })
              }
            />
            <Input
              label="End Date"
              type="date"
              value={educationForm.endDate}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  endDate: e.target.value,
                })
              }
              disabled={educationForm.current}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentEducation"
              checked={educationForm.current}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  current: e.target.checked,
                })
              }
              className="rounded border-border bg-muted text-primary focus:ring-primary"
            />
            <label
              htmlFor="currentEducation"
              className="text-sm text-muted-foreground select-none cursor-pointer"
            >
              I am currently studying here
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => setIsModalOpen(false)}
              uiType="text"
              label="Cancel"
            />
            <Button
              onClick={handleSaveEducation}
              uiType="primary"
              label={editingIndex !== null ? "Update Education" : "Add Education"}
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default UserEducation;
