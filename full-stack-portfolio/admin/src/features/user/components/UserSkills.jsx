import React, { useState } from "react";
import { FaCode, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { Input, Button, RenderIcon, Card, Textarea } from "@/components";
import defaultIcons from "@/defaultIcons";
import { cn } from "@/utils/cn";

const UserSkills = ({ formData, setFormData, className = "" }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newSkill, setNewSkill] = useState({
    name: "",
    icon: defaultIcons.techStack,
    isTechStack: false,
    level: 1,
  });

  const handleSaveSkill = (e) => {
    e.preventDefault();
    const trimmedName = newSkill.name.trim();
    if (!trimmedName) return;

    if (editingIndex !== null) {
      setFormData((prev) => {
        const updatedSkills = [...prev.skills];
        updatedSkills[editingIndex] = {
          ...newSkill,
          name: trimmedName,
          icon: newSkill.icon.trim() || defaultIcons.techStack,
          level: Number(newSkill.level) || 1,
        };
        return { ...prev, skills: updatedSkills };
      });
      setEditingIndex(null);
    } else {
      if (formData.skills.some((s) => s.name.toLowerCase() === trimmedName.toLowerCase())) {
        alert("A skill with this name already exists.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        skills: [
          ...prev.skills,
          {
            ...newSkill,
            name: trimmedName,
            icon: newSkill.icon.trim() || defaultIcons.techStack,
            level: Number(newSkill.level) || 1,
          },
        ],
      }));
    }

    setNewSkill({
      name: "",
      icon: defaultIcons.techStack,
      isTechStack: false,
      level: 1,
    });
  };

  const handleEditSkill = (index) => {
    setEditingIndex(index);
    setNewSkill({ ...formData.skills[index] });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewSkill({
      name: "",
      icon: defaultIcons.techStack,
      isTechStack: false,
      level: 1,
    });
  };

  const handleRemoveSkill = (skillToRemove, e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.name !== skillToRemove.name),
    }));
    if (editingIndex !== null && formData.skills[editingIndex]?.name === skillToRemove.name) {
      handleCancelEdit();
    }
  };

  return (
    <Card className={className}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FaCode className="text-primary" /> Skills
        </h3>
        <div className="flex gap-2 text-sm">
          <a
            href="https://simpleicons.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            SimpleIcons
          </a>
          <span className="text-muted-foreground">•</span>
          <a
            href="https://icon-sets.iconify.design/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Iconify
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="flex flex-col gap-4 bg-muted/30" padding="p-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {editingIndex !== null ? `Editing: ${formData.skills[editingIndex]?.name}` : "Add New Skill"}
            </span>
            {editingIndex !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <FaTimes size={10} /> Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4">
            <Input
              label="Skill Name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Skill Name (e.g. React)"
              className="col-span-10"
            />
            <Input
              label="Level (1-10)"
              type="number"
              placeholder="1-10"
              className="col-span-2"
              min={1}
              max={10}
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            />
          </div>
          <div className="relative grid grid-cols-12 gap-4">
            <Textarea
              label="Icon (svg or iconify name e.g. logos:react)"
              value={newSkill.icon}
              onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
              placeholder="SVG markup or icon name"
              className="col-span-10"
            />
            <div className="col-span-2 flex items-center justify-center pt-4">
              <RenderIcon
                icon={newSkill.icon}
                className="text-3xl text-primary"
                defaultIcon={defaultIcons.techStack}
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isTechStack"
                checked={newSkill.isTechStack}
                onChange={(e) =>
                  setNewSkill({
                    ...newSkill,
                    isTechStack: e.target.checked,
                  })
                }
                className="rounded border-border bg-muted text-primary focus:ring-primary"
              />
              <label htmlFor="isTechStack" className="text-sm text-muted-foreground select-none cursor-pointer">
                Show in Tech Stack Preview
              </label>
            </div>
            <div className="flex gap-2">
              {editingIndex !== null && (
                <Button
                  onClick={handleCancelEdit}
                  type="outline"
                  label="Cancel"
                />
              )}
              <Button
                onClick={handleSaveSkill}
                type="primary"
                icon={editingIndex !== null ? <FaCheck size={14} /> : <FaPlus size={14} />}
                label={editingIndex !== null ? "Update Skill" : "Add Skill"}
                disabled={!newSkill.name}
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap gap-4">
          {formData.skills.map((skill, index) => (
            <Card
              key={index}
              className={cn(
                "px-3 py-2 text-sm flex items-center gap-3 transition-all duration-300 relative group overflow-hidden cursor-pointer",
                skill.isTechStack
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted/50 text-muted-foreground",
                editingIndex === index && "ring-2 ring-primary border-primary shadow-lg scale-105"
              )}
              rounded="rounded-xl"
              padding=""
              onClick={() => handleEditSkill(index)}
              title="Click to edit skill"
            >
              {/* Overlay Action Buttons */}
              <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditSkill(index);
                  }}
                  type="button"
                  className="p-1.5 rounded-full bg-primary/20 hover:bg-primary/40 text-primary transition-colors"
                  title="Edit Skill"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={(e) => handleRemoveSkill(skill, e)}
                  type="button"
                  className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                  title="Delete Skill"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              <span className="text-lg">
                <RenderIcon
                  icon={skill.icon}
                  defaultIcon={defaultIcons.techStack}
                />
              </span>

              <div className="flex flex-col">
                <span className="font-medium leading-none capitalize">
                  {skill.name}
                </span>
                {skill.isTechStack && (
                  <span className="text-[10px] opacity-70 mt-0.5">
                    Tech Stack
                  </span>
                )}
              </div>
              <div
                className="size-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: `conic-gradient(
                    hsl(var(--primary)) ${skill.level * 10}%,
                    hsl(var(--muted)) ${skill.level * 10}%
                  )`,
                }}
              >
                <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {skill.level}
                </div>
              </div>
            </Card>
          ))}
          {formData.skills.length === 0 && (
            <p className="text-muted-foreground text-sm italic w-full text-center py-4">
              No skills added yet.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserSkills;
