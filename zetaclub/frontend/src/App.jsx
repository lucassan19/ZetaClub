import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AgeVerification from "./pages/AgeVerification";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  const [isVerified, setIsVerified] = useState(
    sessionStorage.getItem("age_verified") === "true",
  );

  const handleVerify = () => {
    sessionStorage.setItem("age_verified", "true");
    setIsVerified(true);
  };

  if (!isVerified) {
    return <AgeVerification onVerify={handleVerify} />;
  }

  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/video/:id"
          element={
            <PublicLayout>
              <VideoPlayer />
            </PublicLayout>
          }
        />

        {/* Login Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Dashboard Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Futuras rotas */}
        <Route
          path="/admin/videos"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
