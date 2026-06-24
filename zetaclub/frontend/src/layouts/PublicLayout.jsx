import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <PublicNavbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <footer className="border-t border-white/5 bg-slate-950/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm font-bold mb-4">
            © 2026 67Videos
          </p>
          <div className="flex justify-center gap-4 text-slate-400 text-sm font-bold">
            <Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
            <span>•</span>
            <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <span>•</span>
            <Link to="/contato" className="hover:text-white transition-colors">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
