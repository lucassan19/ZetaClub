import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/d9a71f2c6e84b5a3" replace />;
  }

  return children;
};

export default ProtectedRoute;
