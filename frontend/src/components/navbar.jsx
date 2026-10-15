import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, LogOut, User, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-base-300/80 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-primary font-mono tracking-tight leading-none">
                THINKBOARD
              </h1>
              <p className="text-[10px] text-base-content/50 uppercase tracking-widest font-mono">
                Secure Notes
              </p>
            </div>
          </Link>

          {/* User actions */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-100 border border-base-content/10">
                <User className="size-4 text-primary" />
                <span className="text-sm font-medium text-base-content max-w-[140px] truncate">
                  {user.name}
                </span>
              </div>

              <Link to="/create" className="btn btn-primary btn-sm md:btn-md gap-1.5 shadow-md shadow-primary/20">
                <Plus className="size-4 md:size-5" />
                <span className="hidden sm:inline">New Note</span>
                <span className="sm:hidden">New</span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm md:btn-md text-base-content/70 hover:text-error hover:bg-error/10"
                title="Log Out"
              >
                <LogOut className="size-4 md:size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
