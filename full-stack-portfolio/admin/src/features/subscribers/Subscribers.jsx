import React, { useEffect, useState, useMemo } from "react";
import subscribersService from "./subscribers.service";
import { FaFilter, FaTimes, FaSearch } from "react-icons/fa";
import {
  PageHeader,
  Button,
  ConfirmationModal,
  RightSidebar,
  Input,
  Select,
} from "@/components";
import SubscriberList from "./components/SubscriberList";

import toast from "react-hot-toast";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const fetchSubscribers = async () => {
    try {
      const data = await subscribersService.getSubscribers();
      setSubscribers(data.data);
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = useMemo(() => {
    if (!subscribers) return [];
    return subscribers.filter((sub) => {
      const matchesSearch = sub.email
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

      const isSubscribed = sub.isSubscribed;
      const matchesStatus =
        filters.status === "" ||
        (filters.status === "subscribed" && isSubscribed) ||
        (filters.status === "unsubscribed" && !isSubscribed);

      return matchesSearch && matchesStatus;
    });
  }, [subscribers, filters]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await subscribersService.deleteSubscriber(deleteId);
      toast.success("Subscriber deleted successfully");
      fetchSubscribers();
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete subscriber", error);
      toast.error("Failed to delete subscriber");
    }
  };

  return (
    <div>
      <PageHeader
        title="Subscribers"
        description="Manage your newsletter subscribers."
        children={
          <Button
            onClick={() => setShowFilters(true)}
            uiType="secondary"
            icon={<FaFilter />}
            label="Filters"
          />
        }
      />

      <div className="space-y-6">
        <SubscriberList
          subscribers={filteredSubscribers}
          isLoading={loading}
          onDelete={setDeleteId}
        />
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Subscriber?"
        message="Are you sure you want to remove this subscriber? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />

      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Subscribers"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={() => setFilters({ search: "", status: "" })}
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
            label="Search Email"
            placeholder="Search by email..."
            icon={<FaSearch />}
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />

          <Select
            label="Status"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            options={[
              { value: "", label: "All Statuses" },
              { value: "subscribed", label: "Subscribed" },
              { value: "unsubscribed", label: "Unsubscribed" },
            ]}
          />

          <div className="text-xs text-muted-foreground">
            <p>
              Filtering {filteredSubscribers.length} of{" "}
              {subscribers?.length || 0} subscribers
            </p>
          </div>
        </div>
      </RightSidebar>
    </div>
  );
};

export default Subscribers;
