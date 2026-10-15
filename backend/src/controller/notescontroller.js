import Note from "../config/models/note.js";

// Helper to clean tags
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map((t) => (typeof t === "string" ? t.trim() : ""))
      .filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

// GET /api/notes - fetch all notes for logged-in user with search & tag filtering
export async function getallnotes(req, res) {
  try {
    const { search, tag } = req.query;
    const query = { user: req.user._id };

    // Search filter across title, content, or tags
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Exact or regex tag filter
    if (tag && tag.trim() !== "") {
      query.tags = tag.trim();
    }

    // Pinned notes come first, then latest createdAt
    const notesList = await Note.find(query).sort({ isPinned: -1, createdAt: -1 });
    res.status(200).json(notesList);
  } catch (error) {
    console.log("Error in getallnotes controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/notes/:id - fetch single note ensuring user ownership
export async function getnotebyid(req, res) {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.log("Error in getnotebyid controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/notes - create new note
export async function createnote(req, res) {
  try {
    const { title, content, tags, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const cleanedTags = parseTags(tags);

    const newnote = new Note({
      user: req.user._id,
      title: title.trim(),
      content: content.trim(),
      tags: cleanedTags,
      isPinned: Boolean(isPinned),
    });

    const saved = await newnote.save();
    res.status(201).json(saved);
  } catch (error) {
    console.log("Error in createnote controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// PUT /api/notes/:id - update existing note
export async function updatenote(req, res) {
  try {
    const { title, content, tags, isPinned } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = parseTags(tags);
    if (isPinned !== undefined) updateData.isPinned = Boolean(isPinned);

    const updatednote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatednote) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json(updatednote);
  } catch (error) {
    console.log("Error in updatenote controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/notes/:id - delete note
export async function deletenote(req, res) {
  try {
    const deletednote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletednote) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json(deletednote);
  } catch (error) {
    console.log("Error in deletenote controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// PATCH /api/notes/:id/pin - toggle pinned status
export async function togglepinnote(req, res) {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    console.log("Error in togglepinnote controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
