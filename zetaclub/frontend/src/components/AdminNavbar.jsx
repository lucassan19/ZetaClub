import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, LogOut, ShieldCheck } from 'lucide-react';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="bg-primary-600 p-2 rounded-xl shadow-lg">
              <Play fill="currentColor" size={24} className="text-white ml-0.5" />
            </div>
            <span className="text-2xl font-black text-white">
              Zeta<span className="text-primary-500">Admin</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-400 rounded-xl font-bold text-sm border border-primary-500/20">
              <ShieldCheck size={18} />
              Modo Administrador
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition-all font-bold text-sm border border-red-500/20"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
