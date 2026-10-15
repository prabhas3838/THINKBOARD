import mongoose from "mongoose";

const noteschema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast query by user, pin status, and sorting
noteschema.index({ user: 1, isPinned: -1, createdAt: -1 });

const Note = mongoose.model("note", noteschema);

export default Note;