import React, { useState, useEffect, useMemo } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import {
  FaPlus,
  FaCommentDots,
  FaFilter,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import {
  PageHeader,
  Button,
  ConfirmationModal,
  NotFound,
  RightSidebar,
  Input,
} from "@/components";
import TestimonialSkeleton from "./components/TestimonialSkeleton";
import TestimonialList from "./components/TestimonialList";
import TestimonialForm from "./components/TestimonialForm";
import toast from "react-hot-toast";

const Testimonials = () => {
  const {
    deleteTestimonial,
    fetchTestimonials,
    testimonials,
    isLoading,
    resetTestimonialState,
  } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    id: null,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
  });

  useEffect(() => {
    fetchTestimonials();
    return () => resetTestimonialState();
  }, [fetchTestimonials, resetTestimonialState]);

  const filteredTestimonials = useMemo(() => {
    if (!testimonials) return [];
    return testimonials.filter((t) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        t.name?.toLowerCase().includes(searchLower) ||
        t.role?.toLowerCase().includes(searchLower) ||
        t.message?.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [testimonials, filters]);

  const handleOpenModal = (testimonial = null) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true,
      id: id,
    });
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmState.id) {
        await deleteTestimonial(confirmState.id);
        toast.success("Testimonial deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
      toast.error(error.message || "Failed to delete testimonial.");
    } finally {
      setConfirmState({ isOpen: false, id: null });
    }
  };

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Manage client reviews and feedback."
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(true)}
            uiType="secondary"
            icon={<FaFilter />}
            label="Filters"
          />
          <Button
            onClick={() => handleOpenModal()}
            uiType="primary"
            icon={<FaPlus size={14} />}
            label="Add Testimonial"
          />
        </div>
      </PageHeader>

      {/* Testimonials Grid */}
      <div className="space-y-6">
        {!isLoading && (!testimonials || testimonials.length === 0) ? (
          <NotFound
            Icon={FaCommentDots}
            message="No testimonials created yet."
          />
        ) : !isLoading && (!filteredTestimonials || filteredTestimonials.length === 0) ? (
          <NotFound
            Icon={FaCommentDots}
            message="No testimonials found matching criteria."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              <TestimonialSkeleton />
            ) : (
              <TestimonialList
                testimonials={filteredTestimonials}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      </div>

      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Testimonials"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={() => setFilters({ search: "" })}
              label="Reset"
              uiType="secondary"
              className="w-full"
              icon={<FaTimes />}
            />
            <Button
              onClick={() => setShowFilters(false)}
              label="Done"
              uiType="primary"
              className="w-full"
            />
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Search Testimonials"
            placeholder="Search by name, role..."
            icon={<FaSearch />}
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />

          <div className="text-xs text-muted-foreground">
            <p>
              Filtering {filteredTestimonials.length} of{" "}
              {testimonials?.length || 0} reviews
            </p>
          </div>
        </div>
      </RightSidebar>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <TestimonialForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          testimonialToEdit={editingTestimonial}
        />
      )}

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, id: null })}
        onConfirm={handleConfirmAction}
        title="Delete Testimonial?"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Testimonials;
