import React from "react";
import { NotebookIcon, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Notenotfound = () => {
  return (
    <div className="card bg-base-100/60 backdrop-blur-md border border-base-content/10 max-w-md mx-auto text-center p-8 my-8 shadow-xl">
      <div className="bg-primary/10 rounded-2xl p-6 w-20 h-20 mx-auto flex items-center justify-center mb-4 border border-primary/20">
        <NotebookIcon className="size-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-base-content">No notes yet</h3>
      <p className="text-sm text-base-content/60 mt-2 mb-6">
        Ready to organize your thoughts? Create your first note with custom tags and pin what matters most.
      </p>
      <Link to="/create" className="btn btn-primary gap-2 mx-auto font-semibold">
        <Plus className="size-4" />
        Create Your First Note
      </Link>
    </div>
  );
};

export default Notenotfound;
