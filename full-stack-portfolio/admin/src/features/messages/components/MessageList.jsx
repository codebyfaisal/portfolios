import React from "react";
import { FaTrash, FaEye, FaEnvelopeOpen } from "react-icons/fa";
import { Button, Card } from "@/components";
import { motion } from "motion/react";
import MessageSkeleton from "./MessageSkeleton";

const MessageList = ({
  messages,
  config,
  isLoading,
  onView,
  onDelete,
  onMarkRead,
}) => {
  return (
    <Card className="overflow-hidden p-0 border-border">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Header */}
          <div className="grid grid-cols-[100px_120px_1.5fr_2fr_120px_140px] gap-4 bg-muted/50 text-muted-foreground uppercase font-medium text-xs px-6 py-3 border-b border-border">
            <div className="flex items-center">Status</div>
            <div className="flex items-center">Type</div>
            <div className="flex items-center">From</div>
            <div className="flex items-center">Subject</div>
            <div className="flex items-center">Date</div>
            <div className="flex items-center justify-end">Actions</div>
          </div>

          {/* Body */}
          <div className="divide-y divide-border">
            {isLoading ? (
              <MessageSkeleton />
            ) : (
              messages.map((message, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={message._id}
                  className="grid grid-cols-[100px_120px_1.5fr_2fr_120px_140px] gap-4 px-6 py-4 hover:bg-muted/30 transition-colors items-center"
                >
                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        message.status === "unread"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {message.status}
                    </span>
                  </div>

                  {/* Type */}
                  <div>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border"
                      style={{
                        backgroundColor:
                          config?.messageTypes?.find(
                            (t) => t.type === message.type
                          )?.typeColor || undefined,
                      }}
                    >
                      {message?.type || "General"}
                    </span>
                  </div>

                  {/* From */}
                  <div className="font-medium text-foreground truncate">
                    {message.from}
                  </div>

                  {/* Subject */}
                  <div className="text-muted-foreground truncate">
                    {message.subject}
                  </div>

                  {/* Date */}
                  <div className="text-muted-foreground text-sm">
                    {new Date(message.date).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => onView(message)}
                      uiType="action"
                      icon={<FaEye />}
                      title="View"
                    />
                    {message.status === "unread" && (
                      <Button
                        onClick={() => onMarkRead(message._id)}
                        uiType="action"
                        icon={<FaEnvelopeOpen />}
                        title="Mark as Read"
                      />
                    )}
                    <Button
                      onClick={() => onDelete(message._id)}
                      uiType="action"
                      icon={<FaTrash />}
                      title="Delete"
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MessageList;
