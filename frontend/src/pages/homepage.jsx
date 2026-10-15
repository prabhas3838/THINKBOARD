import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/navbar.jsx";
import RateLimitedui from "../components/RateLimitedui.jsx";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard.jsx";
import api from "../lib/axios.js";
import Notenotfound from "../components/Notenotfound.jsx";
import { Search, X, Tag, Pin, Filter, Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const fetchNotes = async (search = "", tag = "") => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (tag.trim()) params.tag = tag.trim();

      const res = await api.get("/notes", { params });
      setNotes(res.data);
      setIsRateLimited(false);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setIsRateLimited(true);
      } else {
        toast.error("Failed to load notes");
      }
      console.log("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search/tag query fetching
    const timer = setTimeout(() => {
      fetchNotes(searchQuery, selectedTag);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag]);

  // Extract all distinct tags from the current notes list to populate filter chips
  const allTags = useMemo(() => {
    const tagSet = new Set();
    notes.forEach((note) => {
      if (Array.isArray(note.tags)) {
        note.tags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }, [notes]);

  const pinnedNotes = useMemo(() => notes.filter((n) => n.isPinned), [notes]);
  const otherNotes = useMemo(() => notes.filter((n) => !n.isPinned), [notes]);

  const hasFilters = searchQuery.trim() !== "" || selectedTag !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("");
  };

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      {isRateLimited && <RateLimitedui />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Search & Tag Filter Bar */}
        <div className="card bg-base-100/90 backdrop-blur-md shadow-lg border border-base-content/10 mb-8">
          <div className="card-body p-4 sm:p-5">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search notes by title, content, or tags..."
                  className="input input-bordered w-full pl-10 pr-10 bg-base-200/60 focus:bg-base-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Reset Filters button */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="btn btn-ghost btn-sm text-xs gap-1 text-base-content/70 hover:text-primary self-end md:self-auto"
                >
                  <X className="size-3.5" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Tag Filter Chips */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-base-content/5 flex-wrap">
                <span className="text-xs font-mono text-base-content/50 flex items-center gap-1">
                  <Filter className="size-3" /> Filter by tag:
                </span>

                <button
                  onClick={() => setSelectedTag("")}
                  className={`badge text-xs cursor-pointer transition-colors ${
                    selectedTag === ""
                      ? "badge-primary"
                      : "badge-ghost hover:badge-neutral"
                  }`}
                >
                  All
                </button>

                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                    className={`badge text-xs gap-1 cursor-pointer transition-colors ${
                      selectedTag === tag
                        ? "badge-primary"
                        : "badge-ghost hover:badge-neutral"
                    }`}
                  >
                    <Tag className="size-2.5 opacity-60" />
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-sm text-base-content/60 font-mono">Fetching notes...</p>
          </div>
        )}

        {/* Empty state: No notes at all */}
        {!loading && notes.length === 0 && !hasFilters && !isRateLimited && (
          <Notenotfound />
        )}

        {/* Empty state: No results for search/filter */}
        {!loading && notes.length === 0 && hasFilters && !isRateLimited && (
          <div className="card bg-base-100 border border-base-content/10 max-w-md mx-auto text-center p-8 my-10">
            <Search className="size-10 text-primary/60 mx-auto mb-3" />
            <h3 className="text-lg font-bold">No notes matched your search</h3>
            <p className="text-sm text-base-content/60 mt-1 mb-4">
              Try adjusting your search terms or clearing the active filters.
            </p>
            <button onClick={clearFilters} className="btn btn-outline btn-sm mx-auto">
              Clear All Filters
            </button>
          </div>
        )}

        {/* Notes Grid */}
        {!loading && notes.length > 0 && !isRateLimited && (
          <div className="space-y-8">
            {/* Pinned Notes Section */}
            {pinnedNotes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-widest text-primary font-bold">
                  <Pin className="size-3.5 fill-current" />
                  <span>Pinned Notes ({pinnedNotes.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      setNotes={setNotes}
                      onTagClick={(tag) => setSelectedTag(tag)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Notes Section */}
            {otherNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-widest text-base-content/50 font-semibold">
                    <span>Other Notes ({otherNotes.length})</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      setNotes={setNotes}
                      onTagClick={(tag) => setSelectedTag(tag)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Homepage;
