import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/homepage.jsx";
import Createpage from "./pages/createpage.jsx";
import Notedetail from "./pages/notedetail.jsx";
import LoginPage from "./pages/loginpage.jsx";
import RegisterPage from "./pages/registerpage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
      <div className="relative min-h-screen w-full bg-base-300 text-base-content antialiased">
        {/* Subtle glowing dark background gradient */}
        <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none [background:radial-gradient(125%_125%_at_50%_0%,#000_50%,#00FF9D25_100%)]" />

        {/* Routes */}
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Createpage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/note/:id"
            element={
              <ProtectedRoute>
                <Notedetail />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#191E24",
              color: "#E5E6E6",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              fontSize: "14px",
            },
          }}
        />
      </div>
    </AuthProvider>
  );
};

export default App;
