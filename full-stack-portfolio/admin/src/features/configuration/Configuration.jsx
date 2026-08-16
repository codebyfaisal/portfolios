import React, { useEffect, useState, useMemo } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import {
  FaSave,
  FaImage,
  FaStar,
  FaTools,
  FaSlidersH,
  FaUserCircle,
  FaCommentDots,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useBlocker } from "react-router-dom";
import {
  Button,
  Input,
  Textarea,
  ConfirmationModal,
  UnsavedChangesNotifier,
  PageHeader,
  FilePickerModal,
  Card,
  Switch,
} from "@/components";
import toast from "react-hot-toast";
import ConfigMessageTypes from "./components/ConfigMessageTypes";

// Helper component for Image Selection
const ImageSelectionField = ({ value, label, onSelect, onRemove }) => {
  return (
    <div className="flex flex-col mb-6 w-full space-y-2">
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative w-full h-48 bg-muted/30 border border-border overflow-hidden rounded-xl group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 backdrop-blur-xs">
            <Button
              onClick={onSelect}
              icon={<FaImage />}
              label="Change Image"
              uiType="secondary"
              size="sm"
            />
            <Button
              onClick={onRemove}
              label="Remove"
              uiType="danger"
              size="sm"
            />
          </div>
        </div>
      ) : (
        <div
          className="relative w-full h-36 bg-muted/20 border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/40 transition-all rounded-xl group"
          onClick={onSelect}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
            <FaImage className="text-xl" />
          </div>
          <p className="text-sm font-medium text-foreground">Select Image</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click to choose from media manager
          </p>
        </div>
      )}
    </div>
  );
};

const Configuration = () => {
  const {
    config: storeConfig,
    getConfig,
    updateConfig,
    fetchServices,
    resetConfigState,
  } = useDashboardStore();

  const [activeTab, setActiveTab] = useState("system");

  const [config, setConfig] = useState({
    appearance: {
      rounded: true,
      theme: {
        isCustom: false,
        colors: {
          secondary: "#ffffff",
        },
      },
    },
    hero: { greeting: "", title: "", subTitle: "", image: "" },
    about: { title: "", description: "", image: "" },
    messageTypes: [],
    footer: {
      title: "",
      description: "",
    },
    navigation: {
      showCareers: true,
    },
    maintenance: {
      enabled: false,
      title: "",
      message: "",
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  // States for unsaved changes protection
  const [initialData, setInitialData] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // File Picker State
  const [pickerState, setPickerState] = useState({
    isOpen: false,
    section: null,
    field: null,
  });

  const handleOpenPicker = (section, field) => {
    setPickerState({ isOpen: true, section, field });
  };

  const handleFileSelect = (url) => {
    if (pickerState.section && pickerState.field) {
      handleChange(pickerState.section, pickerState.field, url);
    }
    setPickerState({ ...pickerState, isOpen: false });
  };

  useEffect(() => {
    getConfig();
    fetchServices();
    return () => resetConfigState();
  }, [getConfig, fetchServices, resetConfigState]);

  useEffect(() => {
    if (storeConfig) {
      const rounded = storeConfig.appearance?.theme?.borderRadius ?? true;
      const isCustom = storeConfig.appearance?.theme?.isCustom ?? false;
      const colors = storeConfig.appearance?.theme?.colors || {
        secondary: "#ffffff",
      };

      const loadedConfig = {
        appearance: { rounded, theme: { isCustom, colors } },
        hero: storeConfig.hero || {
          greeting: "",
          title: "",
          subTitle: "",
          image: "",
        },
        about: storeConfig.about || { title: "", description: "", image: "" },
        messageTypes: storeConfig.messageTypes || [],
        footer: storeConfig.footer || {
          title: "",
          description: "",
        },
        navigation: {
          showCareers: storeConfig.navigation?.showCareers ?? true,
        },
        maintenance: {
          enabled: storeConfig.maintenance?.enabled ?? false,
          title: storeConfig.maintenance?.title || "",
          message: storeConfig.maintenance?.message || "",
        },
      };
      setConfig(loadedConfig);
      setInitialData(loadedConfig);
    }
  }, [storeConfig]);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(config) !== JSON.stringify(initialData);
  }, [config, initialData]);

  // Block navigation if dirty
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === "blocked") setIsConfirmOpen(true);
  }, [blocker.state]);

  const handleChange = (section, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleColorChange = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: {
          ...prev.appearance.theme,
          colors: {
            ...prev.appearance.theme.colors,
            [key]: value,
          },
        },
      },
    }));
  };

  const handleToggle = (field) => {
    setConfig((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [field]: !prev.appearance[field],
      },
    }));
  };

  const handleNavigationToggle = (field) => {
    setConfig((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        [field]: !prev.navigation?.[field],
      },
    }));
  };

  const handleMaintenanceToggle = () => {
    setConfig((prev) => ({
      ...prev,
      maintenance: {
        ...prev.maintenance,
        enabled: !prev.maintenance?.enabled,
      },
    }));
  };

  const handleThemeToggle = () => {
    setConfig((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: {
          ...prev.appearance.theme,
          isCustom: !prev.appearance.theme.isCustom,
        },
      },
    }));
  };

  const handleMessageTypesChange = (newTypes) =>
    setConfig((prev) => ({ ...prev, messageTypes: newTypes }));

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(false);
    try {
      const payload = {
        ...config,
        appearance: {
          theme: {
            colors: config.appearance.theme.colors,
            isCustom: config.appearance.theme.isCustom,
            borderRadius: config.appearance.rounded,
          },
        },
        navigation: config.navigation,
        maintenance: config.maintenance,
      };

      await updateConfig(payload);
      toast.success("Configuration updated successfully!");
      setInitialData(config);
      setIsConfirmOpen(false);

      if (blocker.state === "blocked") blocker.proceed();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update configuration");
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelNavigation = () => {
    setIsConfirmOpen(false);
    if (blocker.state === "blocked") blocker.reset();
  };

  const handleDiscardChanges = () => {
    setIsConfirmOpen(false);
    if (blocker.state === "blocked") blocker.proceed();
  };

  const tabs = [
    { id: "system", label: "System & Theme", icon: FaSlidersH },
    { id: "hero", label: "Hero Section", icon: FaImage },
    { id: "about", label: "About Section", icon: FaUserCircle },
    { id: "footer", label: "Footer & Categories", icon: FaCommentDots },
  ];

  return (
    <div className="space-y-4">
      <style>
        {`
          input[type="color"] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 6px;
            overflow: hidden;
            cursor: pointer;
          }
          input[type="color"]::-webkit-color-swatch-wrapper {
            padding: 0;
          }
          input[type="color"]::-webkit-color-swatch {
            border: none;
            border-radius: 6px;
          }
          input[type="color"]::-moz-color-swatch {
            border: none;
            border-radius: 6px;
          }
          `}
      </style>

      <PageHeader
        title="System Configuration"
        description="Manage global settings, maintenance mode, themes, and page content."
      >
        <div className="flex flex-wrap items-center gap-2">
          {config.maintenance?.enabled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <FaExclamationTriangle className="text-amber-500" /> Maintenance Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <FaCheckCircle className="text-emerald-500" /> Live Mode
            </span>
          )}
        </div>
      </PageHeader>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-3 shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer text-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="text-base" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-8 pb-12">
        {/* Tab 1: System & Theme */}
        {activeTab === "system" && (
          <div className="space-y-6">
            {/* Maintenance Mode Card */}
            <Card className="space-y-6 border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg">
                    <FaTools />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Maintenance Mode
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Display a Maintenance screen to visitors while updating
                      your site
                    </p>
                  </div>
                </div>
                <Switch
                  checked={config.maintenance?.enabled ?? false}
                  onChange={handleMaintenanceToggle}
                />
              </div>

              {config.maintenance?.enabled && (
                <div className="space-y-4 pt-4 border-t border-amber-500/20 animate-fadeIn">
                  <Input
                    label="Custom Maintenance Title"
                    value={config.maintenance.title}
                    onChange={(e) =>
                      handleChange("maintenance", "title", e.target.value)
                    }
                    placeholder="e.g. System Under Maintenance"
                  />
                  <Textarea
                    label="Custom Maintenance Message"
                    value={config.maintenance.message}
                    onChange={(e) =>
                      handleChange("maintenance", "message", e.target.value)
                    }
                    rows={3}
                    placeholder="e.g. We are performing scheduled upgrades. We will be back online shortly!"
                  />
                </div>
              )}
            </Card>

            {/* Navigation & Theme Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Careers Tab Toggle */}
              <Card className="flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-foreground text-base mb-1">
                    Navbar Careers Link
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Show or hide the Careers tab in the website navbar
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {config.navigation?.showCareers ? "Visible" : "Hidden"}
                  </span>
                  <Switch
                    checked={config.navigation?.showCareers ?? true}
                    onChange={() => handleNavigationToggle("showCareers")}
                  />
                </div>
              </Card>

              {/* Rounded UI Toggle */}
              <Card className="flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-foreground text-base mb-1">
                    Rounded UI Radius
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Enable modern rounded corners across all portfolio cards
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {config.appearance?.rounded ? "Rounded" : "Sharp"}
                  </span>
                  <Switch
                    checked={config.appearance?.rounded ?? true}
                    onChange={() => handleToggle("rounded")}
                  />
                </div>
              </Card>

              {/* Custom Accent Color Picker */}
              <Card className="flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground text-base">
                      Custom Accent Color
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Override primary theme color
                    </p>
                  </div>
                  <Switch
                    checked={config.appearance?.theme?.isCustom ?? false}
                    onChange={handleThemeToggle}
                  />
                </div>

                <div
                  className={`transition-all duration-300 ${
                    config.appearance?.theme?.isCustom
                      ? "opacity-100"
                      : "opacity-40 grayscale pointer-events-none"
                  }`}
                >
                  <div className="flex gap-2 relative items-center">
                    <Input
                      value={
                        config.appearance?.theme?.colors?.secondary || "#ffffff"
                      }
                      onChange={(e) =>
                        handleColorChange("secondary", e.target.value)
                      }
                      placeholder="#ffffff"
                      className="flex-1 pr-12"
                    />
                    <input
                      type="color"
                      value={
                        config.appearance?.theme?.colors?.secondary || "#ffffff"
                      }
                      onChange={(e) =>
                        handleColorChange("secondary", e.target.value)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Hero Section */}
        {activeTab === "hero" && (
          <Card className="space-y-6">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FaImage className="text-primary" /> Hero Section Settings
            </h3>
            <div className="space-y-4">
              <ImageSelectionField
                label="Hero Background / Character Image"
                value={config.hero.image}
                onSelect={() => handleOpenPicker("hero", "image")}
                onRemove={() => handleChange("hero", "image", "")}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Greeting Text"
                  value={config.hero.greeting}
                  onChange={(e) =>
                    handleChange("hero", "greeting", e.target.value)
                  }
                  placeholder="e.g. Hello, I'm"
                />
                <Input
                  label="Main Title / Name"
                  value={config.hero.title}
                  onChange={(e) =>
                    handleChange("hero", "title", e.target.value)
                  }
                  placeholder="e.g. Faisal Khan"
                />
                <Input
                  label="Subtitle / Primary Role"
                  value={config.hero.subTitle}
                  onChange={(e) =>
                    handleChange("hero", "subTitle", e.target.value)
                  }
                  placeholder="e.g. Full Stack Developer"
                  className="col-span-full"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Tab 3: About Section */}
        {activeTab === "about" && (
          <Card className="space-y-6">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FaUserCircle className="text-primary" /> About Section Settings
            </h3>
            <div className="space-y-4">
              <ImageSelectionField
                label="About Section Portrait Image"
                value={config.about.image}
                onSelect={() => handleOpenPicker("about", "image")}
                onRemove={() => handleChange("about", "image", "")}
              />
              <Input
                label="Section Heading"
                value={config.about.title}
                onChange={(e) => handleChange("about", "title", e.target.value)}
                placeholder="e.g. Building digital products with passion"
              />
              <Textarea
                label="Detailed Description"
                value={config.about.description}
                onChange={(e) =>
                  handleChange("about", "description", e.target.value)
                }
                rows={5}
                placeholder="Write your main bio or about description..."
              />
            </div>
          </Card>
        )}

        {/* Tab 4: Footer & Message Categories */}
        {activeTab === "footer" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="space-y-4">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FaStar className="text-amber-400" /> Footer Call-To-Action
                (CTA)
              </h3>
              <Input
                label="CTA Title"
                value={config.footer.title}
                onChange={(e) =>
                  handleChange("footer", "title", e.target.value)
                }
                placeholder="e.g. Ready to build something amazing?"
              />
              <Textarea
                label="CTA Description"
                value={config.footer.description}
                onChange={(e) =>
                  handleChange("footer", "description", e.target.value)
                }
                rows={4}
                placeholder="Let's turn your ideas into reality..."
              />
            </Card>

            <ConfigMessageTypes
              messageTypes={config.messageTypes}
              onChange={handleMessageTypesChange}
            />
          </div>
        )}

        {/* Save Bar */}
        <div className="flex justify-end sticky bottom-0 right-0 z-50 pt-4">
          <Button
            onClick={handleSave}
            uiType="primary"
            icon={<FaSave />}
            label={isSaving ? "Saving Configuration..." : "Save Configuration"}
            disabled={!isDirty || isSaving}
            className={`px-8 py-3 font-semibold shadow-xl backdrop-blur-md ${
              !isDirty
                ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          />
        </div>

        <UnsavedChangesNotifier
          isDirty={isDirty}
          isSaving={isSaving}
          error={saveError}
          onSave={handleSave}
        />

        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={handleCancelNavigation}
          onConfirm={handleSave}
          onCancel={
            blocker.state === "blocked"
              ? handleDiscardChanges
              : handleCancelNavigation
          }
          title={
            blocker.state === "blocked" ? "Unsaved Changes" : "Save Changes?"
          }
          message={
            blocker.state === "blocked"
              ? "You have unsaved configuration changes. Do you want to save them before leaving?"
              : "Are you sure you want to update your portfolio configuration?"
          }
          confirmText="Save & Continue"
          cancelText={
            blocker.state === "blocked" ? "Discard & Leave" : "Cancel"
          }
          isDangerous={false}
        />

        <FilePickerModal
          isOpen={pickerState.isOpen}
          onClose={() => setPickerState({ ...pickerState, isOpen: false })}
          onSelect={handleFileSelect}
          resourceType="images"
        />
      </div>
    </div>
  );
};

export default Configuration;
