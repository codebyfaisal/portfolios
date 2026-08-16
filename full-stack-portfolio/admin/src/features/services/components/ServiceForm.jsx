import React, { useState, useEffect, useMemo } from "react";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";
import {
  Modal,
  Input,
  Textarea,
  Button,
  ConfirmationModal,
  RenderIcon,
} from "@/components";
import useDashboardStore from "@/store/useDashboardStore";
import toast from "react-hot-toast";
import defaultIcons from "@/defaultIcons";

const ServiceForm = ({ isOpen, onClose, serviceToEdit }) => {
  const { addService, updateService } = useDashboardStore();

  const initialFormState = {
    title: "",
    description: "",
    icon: "",
    features: [],
    whyChooseMe: [],
    techStack: [],
    process: [],
    faq: [],
    cta: "",
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
    if (serviceToEdit) {
      initial = {
        title: serviceToEdit.title || "",
        description: serviceToEdit.description || "",
        icon: serviceToEdit.icon || "",
        features: serviceToEdit.features || [],
        whyChooseMe: serviceToEdit.whyChooseMe || [],
        techStack: serviceToEdit.techStack || [],
        process: serviceToEdit.process || [],
        faq: serviceToEdit.faq || [],
        cta: serviceToEdit.cta || "",
      };
      setFormData(initial);
    } else {
      initial = initialFormState;
      setFormData(initial);
    }
    setInitialData(initial);
  }, [serviceToEdit, isOpen]);

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

    const processedData = {
      title: (formData.title || "").trim(),
      description: (formData.description || "").trim(),
      icon: (formData.icon || "").trim() || defaultIcons.service,
      cta: (formData.cta || "").trim(),
      features: (formData.features || [])
        .map((f) => (f || "").trim())
        .filter((f) => f !== ""),
      whyChooseMe: (formData.whyChooseMe || [])
        .map((item) => ({
          title: (item.title || "").trim(),
          description: (item.description || "").trim(),
          icon: (item.icon || "").trim() || defaultIcons.chooseMe,
        }))
        .filter((item) => item.title !== "" || item.description !== ""),
      techStack: (formData.techStack || [])
        .map((item) => ({
          name: (item.name || "").trim(),
          icon: (item.icon || "").trim() || defaultIcons.techStack,
        }))
        .filter((item) => item.name !== ""),
      process: (formData.process || [])
        .map((item) => ({
          title: (item.title || "").trim(),
          description: (item.description || "").trim(),
        }))
        .filter((item) => item.title !== ""),
      faq: (formData.faq || [])
        .map((item) => ({
          question: (item.question || "").trim(),
          answer: (item.answer || "").trim(),
          required: true,
        }))
        .filter((item) => item.question !== "" || item.answer !== ""),
    };

    if (!processedData.title) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (serviceToEdit) {
        await updateService(serviceToEdit._id, processedData);
        toast.success("Service updated successfully!");
      } else {
        await addService(processedData);
        toast.success("Service created successfully!");
      }
      handleClose(true);
    } catch (error) {
      toast.error(error.message || "Failed to save service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setConfirmState({ isOpen: false });
    handleClose(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => handleClose(false)}
        title={serviceToEdit ? "Edit Service" : "Add New Service"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Basic Info
            </h3>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            {/* Icon */}
            <div className="grid grid-cols-6 gap-2 items-center">
              <Input
                label="Icon (Iconify or SimpleIcons)"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder="e.g. mdi:code"
                required
                className="col-span-5"
              />
              <RenderIcon
                icon={formData.icon}
                className="translate-y-[20%] col-span-1 w-full"
                defaultIcon={defaultIcons.service}
              />
            </div>
            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {/* Core Features */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="text-lg font-semibold text-foreground">
                Core Features (List)
              </h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    features: [...formData.features, ""],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={14} />}
                label="Add Feature"
                style={{ padding: "0.5rem 1rem" }}
                type="button"
              />
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[index] = e.target.value;
                      setFormData({ ...formData, features: newFeatures });
                    }}
                    placeholder={`Feature ${
                      index + 1
                    } (e.g. "Responsive Design")`}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      const newFeatures = formData.features.filter(
                        (_, i) => i !== index
                      );
                      setFormData({ ...formData, features: newFeatures });
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

          {/* Section: Why Choose Me */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="text-lg font-semibold text-foreground">
                Why Choose Me
              </h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    whyChooseMe: [
                      ...formData.whyChooseMe,
                      { title: "", description: "", icon: "" },
                    ],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={14} />}
                label="Add Item"
                type="button"
                style={{ padding: "0.5rem 1rem" }}
              />
            </div>
            <div className="space-y-4">
              {formData.whyChooseMe.map((item, index) => {
                const icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-muted/30 border border-border p-4 rounded-lg space-y-3 relative"
                  >
                    <div className="absolute top-2 right-2">
                      <Button
                        onClick={() => {
                          const newItems = formData.whyChooseMe.filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, whyChooseMe: newItems });
                        }}
                        uiType="text"
                        icon={<FaTrash size={12} />}
                        className="text-destructive"
                        type="button"
                        style={{ padding: "0.5rem 1rem" }}
                      />
                    </div>
                    <Input
                      label="Title"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...formData.whyChooseMe];
                        newItems[index].title = e.target.value;
                        setFormData({ ...formData, whyChooseMe: newItems });
                      }}
                      placeholder="e.g. Fast Delivery"
                    />
                    <div className="grid grid-cols-6 gap-2">
                      <Input
                        label="Icon"
                        value={icon}
                        onChange={(e) => {
                          const newItems = [...formData.whyChooseMe];
                          newItems[index].icon = e.target.value;
                          setFormData({ ...formData, whyChooseMe: newItems });
                        }}
                        placeholder="e.g. mdi:clock"
                        className="col-span-5"
                      />
                      <RenderIcon
                        icon={icon}
                        className="translate-y-[20%]"
                        defaultIcon={defaultIcons.chooseMe}
                      />
                    </div>
                    <Textarea
                      label="Description"
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...formData.whyChooseMe];
                        newItems[index].description = e.target.value;
                        setFormData({ ...formData, whyChooseMe: newItems });
                      }}
                      placeholder="Short explanation..."
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Tech Stack */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="text-lg font-semibold text-foreground">
                Tech Stack
              </h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    techStack: [...formData.techStack, { name: "", icon: "" }],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={14} />}
                label="Add Tech"
                type="button"
                style={{ padding: "0.5rem 1rem" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {formData.techStack.map((item, index) => {
                const icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-muted/30 border border-border p-3 rounded-lg space-y-2 relative"
                  >
                    <div className="absolute top-1 right-1">
                      <Button
                        onClick={() => {
                          const newItems = formData.techStack.filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, techStack: newItems });
                        }}
                        uiType="text"
                        icon={<FaTrash size={10} />}
                        className="text-destructive"
                        type="button"
                        style={{ padding: "0.5rem 1rem" }}
                      />
                    </div>
                    <Input
                      label="Name"
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...formData.techStack];
                        newItems[index].name = e.target.value;
                        setFormData({ ...formData, techStack: newItems });
                      }}
                      placeholder="e.g. React"
                    />
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <Input
                          value={icon}
                          onChange={(e) => {
                            const newItems = [...formData.techStack];
                            newItems[index].icon = e.target.value;
                            setFormData({ ...formData, techStack: newItems });
                          }}
                          placeholder="Icon..."
                        />
                      </div>
                      <RenderIcon
                        icon={icon}
                        className="text-xl translate-y-1"
                        defaultIcon={defaultIcons.techStack}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Process */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="text-lg font-semibold text-foreground">Process</h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    process: [
                      ...formData.process,
                      { title: "", description: "" },
                    ],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={14} />}
                label="Add Step"
                type="button"
                style={{ padding: "0.5rem 1rem" }}
              />
            </div>
            <div className="space-y-4">
              {formData.process.map((item, index) => (
                <div
                  key={index}
                  className="bg-muted/50 border border-border p-4 rounded-lg space-y-3 relative"
                >
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={() => {
                        const newItems = formData.process.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, process: newItems });
                      }}
                      uiType="text"
                      icon={<FaTrash size={12} />}
                      className="text-red-500"
                      type="button"
                      style={{ padding: "0.5rem 1rem" }}
                    />
                  </div>
                  <Input
                    label={`Step ${index + 1} Title`}
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...formData.process];
                      newItems[index].title = e.target.value;
                      setFormData({ ...formData, process: newItems });
                    }}
                    placeholder="e.g. Discovery"
                  />
                  <Textarea
                    label="Description"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...formData.process];
                      newItems[index].description = e.target.value;
                      setFormData({ ...formData, process: newItems });
                    }}
                    placeholder="What happens in this step?"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: FAQ */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="text-lg font-semibold text-foreground">FAQ</h3>
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    faq: [...formData.faq, { question: "", answer: "" }],
                  })
                }
                uiType="secondary"
                icon={<FaPlus size={14} />}
                label="Add QA"
                type="button"
                style={{ padding: "0.5rem 1rem" }}
              />
            </div>
            <div className="space-y-4">
              {formData.faq.map((item, index) => (
                <div
                  key={index}
                  className="bg-muted/50 border border-border p-4 rounded-lg space-y-3 relative"
                >
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={() => {
                        const newItems = formData.faq.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, faq: newItems });
                      }}
                      uiType="text"
                      icon={<FaTrash size={12} />}
                      className="text-red-500"
                      type="button"
                    />
                  </div>
                  <Input
                    label="Question"
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...formData.faq];
                      newItems[index].question = e.target.value;
                      setFormData({ ...formData, faq: newItems });
                    }}
                    placeholder="e.g. How long does it take?"
                  />
                  <Textarea
                    label="Answer"
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...formData.faq];
                      newItems[index].answer = e.target.value;
                      setFormData({ ...formData, faq: newItems });
                    }}
                    placeholder="Answer..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: CTA */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Call To Action{" "}
              <span className="text-base text-muted-foreground">
                (Override Default)
              </span>
            </h3>
            <Input
              value={formData.cta}
              onChange={(e) =>
                setFormData({ ...formData, cta: e.target.value })
              }
              placeholder="e.g. Schedule a Free Discovery Call"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 pb-4">
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
              className={`bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors w-auto ${
                !isModalDirty && !isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              label={
                isSubmitting
                  ? "Saving..."
                  : serviceToEdit
                  ? "Update Service"
                  : "Create Service"
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

export default ServiceForm;
