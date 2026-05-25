import React from 'react';
import { ShieldAlert, Play } from 'lucide-react';

const AgeVerification = ({ onVerify }) => {
  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-4xl font-black text-primary-500 mb-2">
            <Play fill="currentColor" size={40} />
            <span>ZetaClub</span>
          </div>
          <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 text-red-500 mb-2">
            <ShieldAlert size={48} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Este é um site adulto</h1>
        </div>

        <div className="space-y-4">
          <p className="text-slate-400 leading-relaxed">
            Este site contém conteúdo sexualmente explícito e é destinado apenas a adultos. 
            Para continuar, você deve confirmar que tem pelo menos 18 anos de idade.
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent w-full"></div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">
            Você tem 18 anos ou mais?
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onVerify}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-900/20 active:scale-95 text-lg"
          >
            Tenho 18 anos ou mais - Entrar
          </button>
          <button
            onClick={handleReject}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-4 rounded-2xl transition-all border border-slate-700 active:scale-95 text-lg"
          >
            Tenho menos de 18 anos - Sair
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Ao entrar, você concorda com nossos termos de uso e política de privacidade.
        </p>
      </div>
    </div>
  );
};

export default AgeVerification;
