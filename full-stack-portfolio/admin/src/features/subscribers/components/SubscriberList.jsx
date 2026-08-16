import React from "react";
import { FaTrash, FaSearch, FaHeart } from "react-icons/fa";
import { Button, Card, NotFound } from "@/components";
import { motion } from "motion/react";
import SubscriberSkeleton from "./SubscriberSkeleton";

const SubscriberList = ({ subscribers, isLoading, onDelete }) => {
  if (!isLoading && (!subscribers || subscribers.length === 0)) {
    return <NotFound Icon={FaSearch} message="No subscribers found." />;
  }

  return (
    <Card className="overflow-hidden p-0 border-border">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_120px_80px] gap-4 bg-muted/50 text-muted-foreground uppercase font-medium text-xs px-6 py-3 border-b border-border">
            <div className="flex items-center">Email</div>
            <div className="flex items-center">Status</div>
            <div className="flex items-center">Date</div>
            <div className="flex items-center justify-end">Actions</div>
          </div>

          {/* Body */}
          <div className="divide-y divide-border">
            {isLoading ? (
              <SubscriberSkeleton />
            ) : (
              subscribers.map((sub, index) => (
                <motion.div
                  key={sub._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-6 py-4 hover:bg-muted/50 transition-colors items-center"
                >
                  <div className="font-medium text-foreground truncate flex items-center gap-2">
                    {sub.email}
                    {sub.likedPosts?.length > 0 && (
                      <FaHeart
                        className="text-red-500 shrink-0"
                        title={`Liked ${sub.likedPosts.length} posts`}
                        size={14}
                      />
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        sub.isSubscribed
                          ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10"
                          : "text-destructive border-destructive/20 bg-destructive/10"
                      }`}
                    >
                      {sub.isSubscribed ? "Subscribed" : "Unsubscribed"}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-right">
                    <Button
                      onClick={() => onDelete(sub._id)}
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

export default SubscriberList;
