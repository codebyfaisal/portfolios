import React from "react";
import { FaEdit, FaTrash, FaLink, FaExternalLinkAlt } from "react-icons/fa";
import { Card, Button } from "@/components";
import { motion } from "motion/react";
import BlogSkeleton from "./BlogSkeleton";
import { CLIENT_URL } from "@/utils/constant";
import useCopy from "@/hooks/useCopy";

const BlogList = ({ posts, isLoading, onEdit, onDelete }) => {
  const { copiedId, copy } = useCopy();

  const copyLink = (slug) => copy(`${CLIENT_URL}/blogs/${slug}`);

  return (
    <Card className="overflow-hidden p-0 border-border">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-[1fr_100px_120px_120px] gap-4 bg-muted/50 text-muted-foreground uppercase font-medium text-xs px-6 py-3 border-b border-border">
            <div className="flex items-center">Title</div>
            <div className="flex items-center">Views</div>
            <div className="flex items-center">Created</div>
            <div className="flex items-center justify-end">Actions</div>
          </div>

          {/* Body */}
          <div className="divide-y divide-border">
            {isLoading ? (
              <BlogSkeleton />
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="grid grid-cols-[1fr_100px_120px_120px] gap-4 px-6 py-4 hover:bg-muted/30 transition-colors items-center"
                >
                  <div className="font-medium text-foreground truncate">
                    {post.title}
                  </div>
                  <div className="text-muted-foreground">{post.views}</div>
                  <div className="text-muted-foreground text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => copyLink(post.slug)}
                      uiType="action"
                      icon={<FaLink />}
                      title="Copy Blog Link"
                    />
                    <Button
                      onClick={() =>
                        window.open(
                          `${CLIENT_URL}/blogs/${post.slug}`,
                          "_blank",
                        )
                      }
                      uiType="action"
                      icon={<FaExternalLinkAlt />}
                      title="View Blog"
                    />
                    <Button
                      onClick={() => onEdit(post)}
                      uiType="action"
                      icon={<FaEdit />}
                      title="Edit"
                    />
                    <Button
                      onClick={() => onDelete(post._id)}
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

export default BlogList;
