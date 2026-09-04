import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Play, Menu, X, LogIn, Zap } from "lucide-react";

const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Planos", href: "#planos" },
  { label: "Prévias", href: "#previas" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Perguntas", href: "#perguntas" },
];

const PublicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAnchorClick = (e, href) => {
    setIsMenuOpen(false);
    if (location.pathname !== "/") {
      e.preventDefault();
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  };

  const handleLoginClick = () => {
    setIsMenuOpen(false);
  };

  const handleCTAClick = (e) => {
    handleAnchorClick(e, "#planos");
  };

  return (
    <nav className="bg-slate-950/80 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20 gap-6">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-gradient-primary p-2 rounded-xl shadow-lg shadow-primary-900/30 group-hover:scale-110 transition-transform duration-300">
              <Play
                fill="currentColor"
                size={24}
                className="text-white ml-0.5"
              />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              67<span className="text-primary-400">VIDEOS</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={handleLoginClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <LogIn size={18} />
              Entrar
            </button>
            <a
              href="#planos"
              onClick={(e) => handleCTAClick(e)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-primary hover:opacity-95 shadow-lg shadow-primary-900/30 hover:shadow-xl hover:shadow-primary-900/40 transition-all active:scale-95"
            >
              <Zap size={18} fill="currentColor" />
              Quero ter acesso
            </a>
          </div>

          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/5 animate-in slide-in-from-top-4 duration-500 space-y-6">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="px-5 py-4 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-white/5"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={handleLoginClick}
                className="flex items-center justify-center gap-2 w-full px-5 py-4 rounded-xl font-bold text-slate-300 border border-white/10 hover:bg-white/5 transition-all"
              >
                <LogIn size={18} />
                Entrar
              </button>
              <a
                href="#planos"
                onClick={(e) => handleCTAClick(e)}
                className="flex items-center justify-center gap-2 w-full px-5 py-4 rounded-xl font-black text-white bg-gradient-primary shadow-lg shadow-primary-900/30 active:scale-95 transition-all"
              >
                <Zap size={18} fill="currentColor" />
                Quero ter acesso
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
