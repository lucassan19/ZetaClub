import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Play, Search, User, Menu, X, Heart, History } from "lucide-react";

const PublicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const NavLink = ({ to, icon: Icon, children, mobile = false }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => mobile && setIsMenuOpen(false)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-sm border ${
          active 
            ? "bg-white text-slate-900 border-white shadow-lg" 
            : "bg-slate-800/40 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white"
        } ${mobile ? "w-full py-4" : ""}`}
      >
        <Icon size={18} />
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-slate-950/80 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-900/20 group-hover:scale-110 transition-transform duration-300">
              <Play
                fill="currentColor"
                size={24}
                className="text-white ml-0.5"
              />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              67<span className="text-primary-500">videos</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex relative flex-1 max-w-xl group"
          >
            <input
              type="text"
              placeholder="Pesquise por títulos, categorias ou tags..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-500 font-bold text-white group-hover:border-white/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-primary-500 transition-colors"
              size={20}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <NavLink to="/favorites" icon={Heart}>Favoritos</NavLink>
              <NavLink to="/history" icon={History}>Histórico</NavLink>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/5 animate-in slide-in-from-top-4 duration-500 space-y-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Pesquisar vídeos..."
                className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-12 focus:outline-none focus:ring-2 focus:ring-primary-500 text-white font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                className="absolute left-4 top-4.5 text-slate-500"
                size={20}
              />
            </form>
            <div className="flex flex-col gap-3">
              <NavLink to="/favorites" icon={Heart} mobile>Favoritos</NavLink>
              <NavLink to="/history" icon={History} mobile>Histórico</NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
