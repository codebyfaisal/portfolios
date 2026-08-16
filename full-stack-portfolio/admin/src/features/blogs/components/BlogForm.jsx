import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import DOMPurify from "dompurify";
import {
  FaSave,
  FaArrowLeft,
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaCode,
  FaHeading,
} from "react-icons/fa";
import useDashboardStore from "@/store/useDashboardStore";
import { toast } from "react-hot-toast";
import { Button, Input, FilePickerModal } from "@/components";
import { cn } from "@/utils/cn";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border-b border-border p-2 flex flex-wrap gap-2 mb-2 sticky top-0 bg-muted z-10">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          "p-2 rounded hover:bg-muted/80 transition-colors",
          editor.isActive("bold")
            ? "bg-muted-foreground/20 text-foreground"
            : "text-muted-foreground"
        )}
        title="Bold"
      >
        <FaBold size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          "p-2 rounded hover:bg-muted/80 transition-colors",
          editor.isActive("italic")
            ? "bg-muted-foreground/20 text-foreground"
            : "text-muted-foreground"
        )}
        title="Italic"
      >
        <FaItalic size={14} />
      </button>
      <div className="w-px bg-muted-foreground/20 mx-1 self-center h-6"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "p-2 rounded hover:bg-muted/80 transition-colors",
          editor.isActive("heading", { level: 2 })
            ? "bg-muted-foreground/20 text-foreground"
            : "text-muted-foreground"
        )}
        title="Heading 2"
      >
        <FaHeading size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-2 rounded hover:bg-muted/80 transition-colors",
          editor.isActive("bulletList")
            ? "bg-muted-foreground/20 text-foreground"
            : "text-muted-foreground"
        )}
        title="Bullet List"
      >
        <FaListUl size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-2 rounded hover:bg-muted/80 transition-colors",
          editor.isActive("orderedList")
            ? "bg-muted-foreground/20 text-foreground"
            : "text-muted-foreground"
        )}
        title="Ordered List"
      >
        <FaListOl size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          "p-2 rounded hover:bg-muted/80 transition-colors",
          editor.isActive("blockquote")
            ? "bg-muted-foreground/20 text-foreground"
            : "text-muted-foreground"
        )}
        title="Blockquote"
      >
        <FaQuoteRight size={14} />
      </button>
      <div className="w-px bg-muted-foreground/20 mx-1 self-center h-6"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn(
          "p-2 rounded hover:bg-muted/80 transition-colors",
          editor.isActive("codeBlock")
            ? "bg-muted-foreground/20 text-foreground"
            : "text-muted-foreground"
        )}
        title="Code Block"
      >
        <FaCode size={14} />
      </button>
      <div className="w-px bg-muted-foreground/20 mx-1 self-center h-6"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className={cn(
          "p-2 rounded hover:bg-muted/80 transition-colors",
          editor.isActive("blockquote")
            ? "bg-muted-foreground/20 text-foreground"
            : "text-muted-foreground"
        )}
        title="Blockquote"
      >
        <FaQuoteRight size={14} />
      </button>
      <div className="w-px bg-muted-foreground/20 mx-1 self-center h-6"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn(
          "p-2 rounded hover:bg-muted/80 transition-colors",
          editor.isActive("codeBlock")
            ? "bg-muted-foreground/20 text-foreground"
            : "text-muted-foreground"
        )}
        title="Code Block"
      >
        <FaCode size={14} />
      </button>
    </div>
  );
};

const BlogForm = ({ post, onCancel, onSuccess }) => {
  const { createPost, updatePost } = useDashboardStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: "",
    tags: "",
  });

  const [pickerOpen, setPickerOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: post?.content || "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none min-h-[300px]",
      },
    },
  });

  // Effect to update form data and editor content when post prop changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        coverImage: post.coverImage || "",
        tags: post.tags ? post.tags.join(", ") : "",
      });
      // Only set content if editor exists and content is different to avoid cursor jumps
      if (editor && post.content && editor.getHTML() !== post.content) {
        editor.commands.setContent(post.content);
      }
    }
  }, [post, editor]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Title and Content are required");
      return;
    }

    setLoading(true);
    try {
      const sanitizedContent = DOMPurify.sanitize(formData.content, {
        USE_PROFILES: { html: true, svg: true }
      });

      const payload = {
        ...formData,
        content: sanitizedContent,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      if (post) {
        await updatePost(post._id, payload);
        toast.success("Post updated successfully!");
      } else {
        await createPost(payload);
        toast.success("Post published successfully!");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <FaArrowLeft /> Back to List
        </button>
        <h2 className="text-2xl font-bold text-foreground">
          {post ? "Edit Post" : "Create New Post"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Input
            label="Post Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter an engaging title..."
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Content
            </label>
            <div className="bg-muted border border-border rounded-lg overflow-hidden min-h-[400px] flex flex-col">
              <MenuBar editor={editor} />
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Excerpt (SEO)
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
              className="w-full bg-muted border border-border rounded-lg p-3 text-foreground focus:ring-1 focus:ring-ring outline-none placeholder-muted-foreground"
              placeholder="Short summary for search engines and previews..."
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Button
            type="submit"
            uiType="primary"
            label={
              loading ? "Saving..." : post ? "Update Post" : "Publish Post"
            }
            icon={<FaSave />}
            className="w-full justify-center my-6"
            disabled={loading}
          />

          <div className="bg-muted border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-foreground">Cover Image</h3>

            {formData.coverImage ? (
              <div className="relative w-full h-48 bg-muted/30 border border-border overflow-hidden rounded-lg group">
                <img
                  src={formData.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    onClick={() => setPickerOpen(true)}
                    label="Change"
                    uiType="secondary"
                    size="sm"
                  />
                  <Button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, coverImage: "" }))
                    }
                    label="Remove"
                    uiType="danger"
                    size="sm"
                  />
                </div>
              </div>
            ) : (
              <div
                className="relative w-full h-32 bg-muted/20 border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/30 transition-all rounded-lg"
                onClick={() => setPickerOpen(true)}
              >
                <p className="text-sm text-muted-foreground">
                  Select Cover Image
                </p>
              </div>
            )}

            <FilePickerModal
              isOpen={pickerOpen}
              onClose={() => setPickerOpen(false)}
              onSelect={(url) =>
                setFormData((prev) => ({ ...prev, coverImage: url }))
              }
              resourceType="images"
            />
          </div>

          <div className="bg-muted border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-foreground">Tags</h3>
            <Input
              label="Comma separated tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="tech, coding, tutorial"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
