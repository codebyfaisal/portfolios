import React, { useState, useEffect, useMemo } from "react";
import { FaSave } from "react-icons/fa";
import {
  Modal,
  Input,
  Textarea,
  Button,
  Select,
  ConfirmationModal,
} from "@/components";
import useDashboardStore from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const PlanForm = ({ isOpen, onClose, planToEdit }) => {
  const { addPlan, updatePlan } = useDashboardStore();

  const initialFormState = {
    name: "",
    minPrice: "",
    maxPrice: "",
    currency: "$",
    hasDelivery: false,
    deliveryTime: "",
    deliveryUnit: "Days",
    hasRevisions: false,
    revisions: "",
    features: [],
    hasAddOns: false,
    addOns: [],
    popular: false,
    isCustom: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [featuresInput, setFeaturesInput] = useState("");
  const [addOnsInput, setAddOnsInput] = useState("");

  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null,
  });

  useEffect(() => {
    let initial;
    if (planToEdit) {
      const fInput = planToEdit.features ? planToEdit.features.join(", ") : "";
      const aInput = planToEdit.addOns?.options
        ? planToEdit.addOns.options.join(", ")
        : "";

      const data = {
        name: planToEdit.name,
        minPrice: planToEdit.price?.min || "",
        maxPrice: planToEdit.price?.max || "",
        currency: planToEdit.price?.currency || "$",
        hasDelivery: planToEdit.deliveryTime?.show || false,
        deliveryTime: planToEdit.deliveryTime?.time || "",
        deliveryUnit: planToEdit.deliveryTime?.unit || "Days",
        hasRevisions: planToEdit.revisions?.show || false,
        revisions: planToEdit.revisions?.count || "",
        features: planToEdit.features || [],
        hasAddOns: planToEdit.addOns?.show || false,
        addOns: planToEdit.addOns?.options || [],
        popular: planToEdit.popular || false,
        isCustom: planToEdit.isCustom || false,
      };

      setFormData(data);
      setFeaturesInput(fInput);
      setAddOnsInput(aInput);

      initial = {
        formData: data,
        featuresInput: fInput,
        addOnsInput: aInput,
      };
    } else {
      setFormData(initialFormState);
      setFeaturesInput("");
      setAddOnsInput("");

      initial = {
        formData: initialFormState,
        featuresInput: "",
        addOnsInput: "",
      };
    }
    setInitialData(initial);
  }, [planToEdit, isOpen]);

  const isModalDirty = useMemo(() => {
    if (!initialData) return false;
    const currentData = {
      formData,
      featuresInput,
      addOnsInput,
    };
    return JSON.stringify(currentData) !== JSON.stringify(initialData);
  }, [formData, featuresInput, addOnsInput, initialData]);

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

    const planData = {
      name: formData.name,
      price: {
        min: Number(formData.minPrice),
        max: Number(formData.maxPrice),
        currency: formData.currency,
      },
      deliveryTime: {
        show: formData.hasDelivery,
        time: Number(formData.deliveryTime),
        unit: formData.deliveryUnit,
      },
      revisions: {
        show: formData.hasRevisions,
        count: Number(formData.revisions),
      },
      features: featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
      addOns: {
        show: formData.hasAddOns,
        options: addOnsInput
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
      },
      popular: formData.popular,
      isCustom: formData.isCustom,
    };

    setIsSubmitting(true);
    try {
      if (planToEdit) {
        await updatePlan(planToEdit._id, planData);
        toast.success("Plan updated successfully!");
      } else {
        await addPlan(planData);
        toast.success("Plan created successfully!");
      }
      handleClose(true);
    } catch (error) {
      console.error("Failed to save plan:", error);
      toast.error(error.message || "Failed to save plan.");
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
        title={planToEdit ? "Edit Plan" : "Add New Plan"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Plan Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="e.g. Basic, Pro"
              className="md:col-span-2"
            />
            <Input
              label="Currency"
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              required
              placeholder="$"
              className="md:col-span-1"
            />
            <Input
              label="Min Price"
              type="number"
              value={formData.minPrice}
              onChange={(e) =>
                setFormData({ ...formData, minPrice: e.target.value })
              }
              placeholder="0"
              className="md:col-span-1"
            />
            <Input
              label="Max Price"
              type="number"
              value={formData.maxPrice}
              onChange={(e) =>
                setFormData({ ...formData, maxPrice: e.target.value })
              }
              placeholder="1000"
              className="md:col-span-1"
            />
          </div>

          <Textarea
            label="Features (comma separated)"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            required
            placeholder="e.g. Feature 1, Feature 2"
            rows={3}
          />

          <div className="border-b border-border" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
            <Input
              label="Delivery Estimate"
              type="checkbox"
              checked={formData.hasDelivery}
              onChange={(e) =>
                setFormData({ ...formData, hasDelivery: e.target.checked })
              }
              className="flex items-center gap-2 justify-between [&>label]:w-full [&>input]:w-min col-span-full"
            />
            <Input
              label="Time"
              type="number"
              value={formData.deliveryTime}
              onChange={(e) =>
                setFormData({ ...formData, deliveryTime: e.target.value })
              }
              disabled={!formData.hasDelivery}
              placeholder="e.g. 3"
              className={`md:col-span-2 ${
                formData.hasDelivery ? "" : "opacity-50 cursor-not-allowed"
              }`}
            />
            <Select
              label="Unit"
              value={formData.deliveryUnit}
              onChange={(e) =>
                setFormData({ ...formData, deliveryUnit: e.target.value })
              }
              disabled={!formData.hasDelivery}
              options={[
                { value: "Days", label: "Days" },
                { value: "Weeks", label: "Weeks" },
                { value: "Months", label: "Months" },
              ]}
              className={`md:col-span-1 ${
                formData.hasDelivery ? "" : "opacity-25 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="border-b border-border" />

          <div>
            <Input
              label="Total Revisions"
              type="checkbox"
              checked={formData.hasRevisions}
              onChange={(e) =>
                setFormData({ ...formData, hasRevisions: e.target.checked })
              }
              className="flex items-center gap-2 justify-between [&>label]:w-full [&>input]:w-min"
            />
            <Input
              type="number"
              value={formData.revisions}
              onChange={(e) =>
                setFormData({ ...formData, revisions: e.target.value })
              }
              placeholder="e.g. 3"
              disabled={!formData.hasRevisions}
              className={`w-full ${
                formData.hasRevisions ? "" : "opacity-50 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="border-b border-border" />

          <div className="space-y-2">
            <Input
              label="Add-ons"
              type="checkbox"
              checked={formData.hasAddOns}
              onChange={(e) =>
                setFormData({ ...formData, hasAddOns: e.target.checked })
              }
              className="flex items-center gap-2 justify-between [&>label]:w-full [&>input]:w-min"
            />
            <Textarea
              value={addOnsInput}
              onChange={(e) => setAddOnsInput(e.target.value)}
              placeholder="Add-on 1, Add-on 2"
              rows={2}
              className={`w-full ${
                formData.hasAddOns ? "" : "opacity-30 cursor-not-allowed"
              }`}
              disabled={!formData.hasAddOns}
            />
          </div>

          <div className="flex gap-4">
            <Input
              label="Popular"
              type="checkbox"
              checked={formData.popular}
              onChange={(e) =>
                setFormData({ ...formData, popular: e.target.checked })
              }
              className="flex items-center gap-2 justify-between [&>label]:w-full [&>input]:w-min *:m-0"
            />

            <Input
              label="Custom Plan Style"
              type="checkbox"
              checked={formData.isCustom}
              onChange={(e) =>
                setFormData({ ...formData, isCustom: e.target.checked })
              }
              className="flex items-center gap-2 justify-between [&>label]:w-full [&>input]:w-min *:m-0"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              onClick={() => handleClose(false)}
              uiType="text"
              label="Cancel"
            />
            <Button
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
                  : planToEdit
                  ? "Update Plan"
                  : "Create Plan"
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

export default PlanForm;
