import React, { useState, useEffect, useMemo } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import {
  FaTrash,
  FaEnvelope,
  FaFilter,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import {
  Button,
  ConfirmationModal,
  Modal,
  PageHeader,
  NotFound,
  RightSidebar,
  Input,
  Select,
} from "@/components";
import { motion } from "motion/react";
import MessageList from "./components/MessageList";
import toast from "react-hot-toast";

const Messages = () => {
  const {
    markMessageRead,
    deleteMessage,
    fetchMessages,
    messages,
    config,
    getConfig,
    isLoading,
    resetMessageState,
  } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null,
    id: null,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  useEffect(() => {
    fetchMessages();
    if (!config?.messageTypes) getConfig();

    return () => resetMessageState();
  }, [fetchMessages, getConfig, resetMessageState]);

  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    return messages.filter((msg) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        msg.from?.toLowerCase().includes(searchLower) ||
        msg.email?.toLowerCase().includes(searchLower) ||
        msg.subject?.toLowerCase().includes(searchLower);

      const matchesStatus =
        filters.status === "" || msg.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [messages, filters]);

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    if (message.status === "unread") {
      try {
        await markMessageRead(message._id);
        toast.success("Message marked as read");
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      toast.success("Message marked as read");
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleDelete = (_id) => {
    setConfirmState({
      isOpen: true,
      type: "delete",
      id: _id,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMessage(confirmState.id);
      toast.success("Message deleted successfully!");
      if (selectedMessage && selectedMessage._id === confirmState.id) {
        handleCloseModal();
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error(error.message || "Failed to delete message.");
    } finally {
      setConfirmState({ isOpen: false, type: null, id: null });
    }
  };

  return (
    <div>
      <PageHeader
        title="Messages"
        description="View and manage your incoming messages."
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
        {!isLoading && (!messages || messages.length === 0) ? (
          <NotFound Icon={FaEnvelope} message="No messages received yet." />
        ) : !isLoading &&
          (!filteredMessages || filteredMessages.length === 0) ? (
          <NotFound
            Icon={FaEnvelope}
            message="No messages found matching criteria."
          />
        ) : (
          <MessageList
            messages={filteredMessages}
            config={config}
            isLoading={isLoading}
            onView={handleViewMessage}
            onDelete={handleDelete}
            onMarkRead={handleMarkRead}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedMessage ? selectedMessage.subject : "View Message"}
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div className="space-y-1">
                <p className="">
                  From:{" "}
                  <span className="text-sm text-primary font-semibold">
                    {selectedMessage.from}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Email: {selectedMessage.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Type:{" "}
                  <span className="text-foreground">
                    {selectedMessage.type || "General"}
                  </span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(selectedMessage.date).toLocaleString()}
              </span>
            </div>

            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {selectedMessage.message || "No message content."}
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <Button onClick={handleCloseModal} uiType="text" label="Close" />
              <Button
                onClick={() => handleDelete(selectedMessage._id)}
                uiType="danger"
                icon={<FaTrash size={12} />}
                label="Delete"
              />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, type: null, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Message?"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />

      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Messages"
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
            label="Search Messages"
            placeholder="Sender, email, subject..."
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
              { value: "read", label: "Read" },
              { value: "unread", label: "Unread" },
            ]}
          />

          <div className="text-xs text-muted-foreground">
            <p>
              Filtering {filteredMessages.length} of {messages?.length || 0}{" "}
              messages
            </p>
          </div>
        </div>
      </RightSidebar>
    </div>
  );
};

export default Messages;
