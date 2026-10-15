import React from "react";
import { Link } from "react-router-dom";
import { PenSquare, Trash2, Pin, Tag } from "lucide-react";
import { formatDate } from "../lib/utils.js";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

const NoteCard = ({ note, setNotes, onTagClick }) => {
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${note._id}`);
      setNotes((prev) => prev.filter((item) => item._id !== note._id));
      toast.success("Note deleted");
    } catch (error) {
      console.log("Failed to delete note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleTogglePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await api.patch(`/notes/${note._id}/pin`);
      const updated = res.data;

      setNotes((prev) => {
        const next = prev.map((item) => (item._id === updated._id ? updated : item));
        // Keep sorted: pinned first, then newest
        return next.sort((a, b) => {
          if (a.isPinned === b.isPinned) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.isPinned ? -1 : 1;
        });
      });

      toast.success(updated.isPinned ? "Note pinned to top" : "Note unpinned");
    } catch (error) {
      console.log("Failed to toggle pin:", error);
      toast.error("Failed to update pin status");
    }
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className={`card bg-base-100 hover:shadow-xl transition-all duration-200 border relative group overflow-hidden ${
        note.isPinned
          ? "border-primary/60 shadow-md shadow-primary/10 border-t-4 border-t-primary"
          : "border-base-content/10 hover:border-base-content/30 border-t-4 border-t-base-content/20"
      }`}
    >
      <div className="card-body p-5">
        {/* Header: Title and Pin button */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="card-title text-base-content font-bold text-lg line-clamp-1 flex-1">
            {note.title}
          </h3>

          <button
            onClick={handleTogglePin}
            className={`btn btn-circle btn-xs ${
              note.isPinned
                ? "btn-primary"
                : "btn-ghost text-base-content/40 hover:text-primary"
            }`}
            title={note.isPinned ? "Unpin note" : "Pin note to top"}
          >
            <Pin className={`size-3.5 ${note.isPinned ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Content Preview */}
        <p className="text-base-content/70 text-sm line-clamp-3 my-2 whitespace-pre-wrap">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  if (onTagClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    onTagClick(tag);
                  }
                }}
                className="badge badge-sm badge-outline gap-1 text-[11px] font-mono cursor-pointer hover:badge-primary transition-colors"
              >
                <Tag className="size-2.5 opacity-60" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Date & Actions */}
        <div className="card-actions justify-between items-center mt-4 pt-3 border-t border-base-content/5">
          <span className="text-xs text-base-content/50 font-mono">
            {formatDate(note.createdAt)}
          </span>

          <div className="flex items-center gap-1">
            <span className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-primary">
              <PenSquare className="size-3.5" />
            </span>
            <button
              onClick={handleDelete}
              className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-error hover:bg-error/10"
              title="Delete note"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
