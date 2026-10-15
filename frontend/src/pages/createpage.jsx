import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Pin, Tag, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

const Createpage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please provide both a title and content");
      return;
    }

    setLoading(true);

    try {
      // Include any lingering tag in tagInput if user typed without pressing Enter
      let finalTags = [...tags];
      const lingeringTag = tagInput.trim().replace(/^#/, "");
      if (lingeringTag && !finalTags.includes(lingeringTag)) {
        finalTags.push(lingeringTag);
      }

      await api.post("/notes", {
        title: title.trim(),
        content: content.trim(),
        tags: finalTags,
        isPinned,
      });

      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note:", error);
      if (error.response && error.response.status === 429) {
        toast.error("Rate limit reached. Please wait a moment.");
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="btn btn-ghost btn-sm mb-6 gap-2 text-base-content/70 hover:text-base-content"
        >
          <ArrowLeft className="size-4" /> Back to Notes
        </Link>

        <div className="card bg-base-100/90 backdrop-blur-md shadow-2xl border border-base-content/10">
          <div className="card-body p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-content/10">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-base-content">
                  Create New Note
                </h2>
                <p className="text-xs text-base-content/50 font-mono mt-0.5">
                  Write, tag, and organize your thought
                </p>
              </div>

              {/* Pin Switch */}
              <label
                className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border transition-all ${
                  isPinned
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-base-content/20 text-base-content/60 hover:border-base-content/40"
                }`}
              >
                <Pin className={`size-4 ${isPinned ? "fill-current" : ""}`} />
                <span className="text-xs font-semibold select-none">
                  {isPinned ? "Pinned to Top" : "Pin Note"}
                </span>
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="hidden"
                />
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title Field */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-sm">Note Title</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., System Design Ideas"
                  className="input input-bordered w-full font-medium"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Tags Input */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-sm flex items-center gap-1.5">
                    <Tag className="size-3.5 text-primary" /> Tags
                  </span>
                  <span className="label-text-alt text-xs text-base-content/50">
                    Press Enter or comma to add
                  </span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., ideas, work, backend"
                    className="input input-bordered flex-1 text-sm font-mono"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="btn btn-outline btn-neutral text-xs"
                  >
                    Add Tag
                  </button>
                </div>

                {/* Tag Pills */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-primary badge-outline gap-1.5 py-3 px-3 font-mono text-xs"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-error"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Textarea */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-sm">Content</span>
                </label>
                <textarea
                  required
                  placeholder="Write down your thoughts, code snippets, or plans..."
                  className="textarea textarea-bordered h-48 w-full leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Submit Buttons */}
              <div className="card-actions justify-end gap-3 pt-4 border-t border-base-content/10">
                <Link to="/" className="btn btn-ghost">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary min-w-[130px] font-semibold"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Save Note"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createpage;
