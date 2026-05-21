import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AgeVerification from './pages/AgeVerification';

function App() {
  // Estado global de verificação de idade
  const [isVerified, setIsVerified] = useState(localStorage.getItem('age_verified') === 'true');

  const handleVerify = () => {
    localStorage.setItem('age_verified', 'true');
    setIsVerified(true);
  };

  // Se não estiver verificado, mostra APENAS a tela de aviso, independente da rota
  if (!isVerified) {
    return <AgeVerification onVerify={handleVerify} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/video/:id" element={<VideoPlayer />} />

            {/* Rotas Administrativas */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
              />
              
              {/* Fallback para rotas não encontradas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
    </Router>
  );
}

export default App;
