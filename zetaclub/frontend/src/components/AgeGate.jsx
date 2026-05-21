import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AgeGate = ({ children }) => {
  const isVerified = localStorage.getItem('age_verified') === 'true';
  const location = useLocation();

  // Se não estiver verificado e não estiver na página de verificação, redireciona
  if (!isVerified && location.pathname !== '/age-verification') {
    return <Navigate to="/age-verification" replace />;
  }

  // Se já estiver verificado e tentar entrar na página de verificação, manda pra home
  if (isVerified && location.pathname === '/age-verification') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AgeGate;
