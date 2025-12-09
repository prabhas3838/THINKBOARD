import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx";
import RateLimitedui from "../components/RateLimitedui.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard.jsx";
import api from "../lib/axios.js";
import Notenotfound from "../components/Notenotfound.jsx";

const Homepage = () => {

  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");   // ✅ FIXED
  
        console.log(res.data);
        setNotes(res.data);
        setLoading(false);
  
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("failed to load notes");
        }
  
        console.log("Error fetching notes:", error);
        setLoading(false);
      }
    };
  
    fetchNotes();
  }, []);
  

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedui />}

      <div className="max-w-7xl mx-auto p-4 m-6">

        {loading && (
          <p className="max-w-7xl text-center mt-10 text-primary py-10">
            Loading notes...
          </p>
        )}
        {notes.length==0 && !isRateLimited && <Notenotfound/>}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note)=>(
              <NoteCard key={note._id} note={note} setNote={setNotes}/>
            )
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Homepage;
