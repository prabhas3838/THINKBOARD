import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Createpage from "./pages/createpage";
import Notedetail from "./pages/notedetail";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="relative h-full w-full">
    <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
     

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create" element={<Createpage />} />
        <Route path="/note/:id" element={<Notedetail />} />
      </Routes>

      {/* IMPORTANT: Add this once per app */}
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
