import React, { useState, useEffect } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { FaPlus, FaServicestack } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Button, ConfirmationModal, PageHeader, NotFound } from "@/components";
import ServiceSkeleton from "./components/ServiceSkeleton";
import ServiceList from "./components/ServiceList";
import ServiceForm from "./components/ServiceForm";

const Services = () => {
  const [searchParams] = useSearchParams();
  const {
    updateService,
    deleteService,
    fetchServices,
    services,
    isLoading,
    resetServiceState,
  } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    fetchServices();
    return () => resetServiceState();
  }, [fetchServices, resetServiceState]);

  useEffect(() => {
    if (searchParams.get("new")) setIsModalOpen(true);
  }, [searchParams]);

  const handleOpenModal = (service = null) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleToggleFeature = async (service) => {
    try {
      await updateService(service._id, {
        ...service,
        isFeatured: !service.isFeatured,
      });
      toast.success(
        `Service ${!service.isFeatured ? "featured" : "unfeatured"} successfully!`,
      );
    } catch (error) {
      toast.error(error.message || "Failed to update service feature status.");
    }
  };

  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true,
      id: id,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteService(confirmState.id);
      toast.success("Service deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete service.");
    } finally {
      setConfirmState({ isOpen: false, id: null });
    }
  };

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage the services you offer."
        children={
          <Button
            onClick={() => handleOpenModal(null)}
            uiType="primary"
            icon={<FaPlus size={14} />}
            label="Add Service"
          />
        }
      />

      <div className="space-y-6">
        {!isLoading && (!services || services.length === 0) ? (
          <NotFound Icon={FaServicestack} message="No services created yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              <ServiceSkeleton />
            ) : (
              <ServiceList
                services={services}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onToggleFeature={handleToggleFeature}
              />
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ServiceForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          serviceToEdit={editingService}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Service?"
        message="Are you sure you want to delete this service?"
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Services;
