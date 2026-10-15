import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios.js";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("thinkboard_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("thinkboard_token") || null);
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem("thinkboard_token");
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        localStorage.setItem("thinkboard_user", JSON.stringify(res.data.user));
      } catch (error) {
        console.log("Token verification failed:", error);
        localStorage.removeItem("thinkboard_token");
        localStorage.removeItem("thinkboard_user");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("thinkboard_token", token);
      localStorage.setItem("thinkboard_user", JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Check your credentials.";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("thinkboard_token", token);
      localStorage.setItem("thinkboard_user", JSON.stringify(user));
      toast.success(`Welcome to THINKBOARD, ${user.name}!`);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("thinkboard_token");
    localStorage.removeItem("thinkboard_user");
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
