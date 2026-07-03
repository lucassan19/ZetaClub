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
import Favorites from "./pages/Favorites";
import WatchHistory from "./pages/History";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";

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

        <Route
          path="/favorites"
          element={
            <PublicLayout>
              <Favorites />
            </PublicLayout>
          }
        />

        <Route
          path="/history"
          element={
            <PublicLayout>
              <WatchHistory />
            </PublicLayout>
          }
        />

        <Route
          path="/termos-de-uso"
          element={
            <PublicLayout>
              <TermsOfUse />
            </PublicLayout>
          }
        />

        <Route
          path="/politica-de-privacidade"
          element={
            <PublicLayout>
              <PrivacyPolicy />
            </PublicLayout>
          }
        />

        <Route
          path="/contato"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        {/* Login Admin (rota secreta) */}
        <Route path="/d9a71f2c6e84b5a3" element={<AdminLogin />} />

        {/* Dashboard Admin (rota secreta) */}
        <Route
          path="/d9a71f2c6e84b5a3/dashboard"
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
