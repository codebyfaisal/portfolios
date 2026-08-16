import React, { useEffect, useState, useMemo } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import {
  FaPlus,
  FaNewspaper,
  FaFilter,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import {
  Button,
  PageHeader,
  NotFound,
  RightSidebar,
  Input,
  Select,
} from "@/components";
import BlogList from "./components/BlogList";
import BlogForm from "./components/BlogForm";

const Blogs = () => {
  const posts = useDashboardStore((state) => state.posts);
  const fetchPosts = useDashboardStore((state) => state.fetchPosts);
  const deletePost = useDashboardStore((state) => state.deletePost);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const resetBlogState = useDashboardStore((state) => state.resetBlogState);
  const [view, setView] = useState("list");
  const [selectedPost, setSelectedPost] = useState(null);

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });

  useEffect(() => {
    fetchPosts();
    return () => resetBlogState();
  }, [fetchPosts, resetBlogState]);

  const uniqueCategories = useMemo(() => {
    if (!posts) return [];
    const categories = posts.map((p) => p.category).filter(Boolean);
    return [...new Set(categories)];
  }, [posts]);

  // Filter Logic
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post) => {
      const matchesSearch = post.title
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === "" || post.category === filters.category;

      return matchesSearch && matchesCategory;
    });
  }, [posts, filters]);

  const handleCreate = () => {
    setSelectedPost(null);
    setView("create");
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setView("edit");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
    }
  };

  const handleSuccess = () => {
    fetchPosts();
    setView("list");
  };

  if (view === "create" || view === "edit") {
    return (
      <BlogForm
        post={selectedPost}
        onCancel={() => setView("list")}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        description="Manage your articles and publications."
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(true)}
            uiType="secondary"
            icon={<FaFilter />}
            label="Filters"
          />
          <Button
            onClick={handleCreate}
            uiType="primary"
            label="Write New Article"
            icon={<FaPlus size={14} />}
          />
        </div>
      </PageHeader>

      <div className="space-y-6">
        {!isLoading && (!posts || posts.length === 0) ? (
          <NotFound
            Icon={FaNewspaper}
            message="No articles created yet."
            className="w-full h-full flex flex-col items-center justify-center text-muted-foreground"
          />
        ) : !isLoading && (!filteredPosts || filteredPosts.length === 0) ? (
          <NotFound
            Icon={FaNewspaper}
            message="No articles found matching your criteria."
            className="w-full h-full flex flex-col items-center justify-center text-muted-foreground"
          />
        ) : (
          <BlogList
            posts={filteredPosts}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={() => {}}
          />
        )}
      </div>

      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Articles"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={() => setFilters({ search: "", category: "" })}
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
            label="Search Articles"
            placeholder="Search by title..."
            icon={<FaSearch />}
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />

          <Select
            label="Category"
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            options={[
              { value: "", label: "All Categories" },
              ...uniqueCategories.map((cat) => ({ value: cat, label: cat })),
            ]}
          />

          <div className="text-xs text-muted-foreground">
            <p>
              Filtering {filteredPosts.length} of {posts?.length || 0} articles
            </p>
          </div>
        </div>
      </RightSidebar>
    </div>
  );
};

export default Blogs;
