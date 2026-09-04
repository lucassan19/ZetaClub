import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { Play, ShieldCheck } from 'lucide-react';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <PublicNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur-xl py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pb-10 border-b border-white/5">
            <div className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-3 group shrink-0">
                <div className="bg-gradient-primary p-2 rounded-xl shadow-lg shadow-primary-900/30 group-hover:scale-110 transition-transform duration-300">
                  <Play fill="currentColor" size={22} className="text-white ml-0.5" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">
                  67<span className="text-primary-400">VIDEOS</span>
                </span>
              </Link>
              <p className="text-slate-500 text-sm font-medium max-w-sm">
                Conteúdo premium exclusivo. Novos vídeos toda semana.
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-400 rounded-xl font-bold text-sm border border-primary-500/20">
              <ShieldCheck size={18} />
              +18 · Conteúdo para adultos
            </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-slate-500 text-sm font-bold">
              © 2026 67Videos. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 text-sm font-bold">
              <Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de uso</Link>
              <span className="text-slate-700">•</span>
              <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Política de privacidade</Link>
              <span className="text-slate-700">•</span>
              <Link to="/contato" className="hover:text-white transition-colors">Suporte / Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
