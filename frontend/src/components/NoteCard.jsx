import { PenSquare, Trash2Icon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/utils.js";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
const NoteCard = ({ note,setNote }) => {
    const handledelete=async(e,id)=>{
        e.preventDefault();
        if(!window.confirm("are u sure alla retrive cheyalem pooka")) return;
        try {
            await api.delete(`/notes/${id}`)
            setNote((prev) => {
                return prev.filter((note) => note._id !== id);
              }
              )

            toast.success("successfully deleted")
            
        } catch (error) {
            console.log("failed to delete")
            toast.error("failed to delete")
        }
    }
  return (
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-t-4 border-solid border-[#00FF9D]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>

        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(note.createdAt)}
          </span>
          <div className="flex items-center gap-1">
            <PenSquare className="size-4" />
            <button className="btn btn-ghost" onClick={(e)=>handledelete(e,note._id)}>
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
