import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Play, Search, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [search, setSearch] = useState('');

  // Não mostrar Navbar na página de verificação de idade
  if (location.pathname === '/age-verification') return null;

  // Verificar se estamos na área administrativa
  const isAdminArea = location.pathname.startsWith('/admin');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${search}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-400">
          <Play fill="currentColor" size={32} />
          <span>ZetaClub</span>
        </Link>

        {/* Campo de pesquisa apenas na home/biblioteca pública */}
        {!isAdminArea && (
          <form onSubmit={handleSearch} className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Pesquisar vídeos..."
              className="w-full bg-slate-900 border border-slate-700 rounded-full py-2 px-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          </form>
        )}

        <div className="flex items-center gap-4">
          {token && isAdminArea ? (
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-medium">
              <LogOut size={18} />
              Sair do Painel
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
