import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  Trash2,
  Pin,
  Tag,
  X,
  Save,
  Clock,
} from "lucide-react";
import { formatDate } from "../lib/utils.js";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        const data = res.data;
        setNote(data);
        setTitle(data.title || "");
        setContent(data.content || "");
        setTags(Array.isArray(data.tags) ? data.tags : []);
        setIsPinned(Boolean(data.isPinned));
      } catch (error) {
        console.log("Error fetching note:", error);
        toast.error("Failed to fetch the note");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);

    try {
      let finalTags = [...tags];
      const lingeringTag = tagInput.trim().replace(/^#/, "");
      if (lingeringTag && !finalTags.includes(lingeringTag)) {
        finalTags.push(lingeringTag);
      }

      const res = await api.put(`/notes/${id}`, {
        title: title.trim(),
        content: content.trim(),
        tags: finalTags,
        isPinned,
      });

      setNote(res.data);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin size-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content"
          >
            <ArrowLeft className="size-4" /> Back to Notes
          </Link>

          <button
            onClick={handleDelete}
            className="btn btn-error btn-outline btn-sm gap-1.5"
          >
            <Trash2 className="size-4" /> Delete Note
          </button>
        </div>

        {/* Edit Card */}
        <div className="card bg-base-100/90 backdrop-blur-md shadow-2xl border border-base-content/10">
          <div className="card-body p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-base-content/10 mb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-base-content">
                  Edit Note
                </h2>
                {note?.createdAt && (
                  <div className="flex items-center gap-1.5 text-xs text-base-content/50 font-mono mt-1">
                    <Clock className="size-3" />
                    <span>Created: {formatDate(note.createdAt)}</span>
                    {note.updatedAt && (
                      <span className="ml-2">
                        • Updated: {formatDate(note.updatedAt)}
                      </span>
                    )}
                  </div>
                )}
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

            <form onSubmit={handleSave} className="space-y-5">
              {/* Title Field */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-sm">Title</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Note title"
                  className="input input-bordered w-full font-medium"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Tags Field */}
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

              {/* Content Field */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-sm">Content</span>
                </label>
                <textarea
                  required
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-48 w-full leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Save & Cancel */}
              <div className="card-actions justify-end gap-3 pt-4 border-t border-base-content/10">
                <Link to="/" className="btn btn-ghost">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary min-w-[140px] font-semibold gap-1.5"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <Save className="size-4" /> Save Changes
                    </>
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

export default NoteDetailPage;