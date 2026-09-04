import React from 'react';
import { Flame, Zap, ArrowRight, Lock } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-primary-900/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900/70 to-slate-950" />
          <div className="absolute -top-40 -left-20 w-[30rem] h-[30rem] bg-accent-500/20 rounded-full blur-[140px]" />
          <div className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] bg-primary-500/20 rounded-full blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 80% 70%, #fff 0.5px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 p-8 md:p-14 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="space-y-5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                <Flame size={14} fill="currentColor" className="text-primary-300" />
                Oferta por tempo limitado
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                PRONTO PARA TER ACESSO AO{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-200 to-white">
                  MELHOR CONTEÚDO?
                </span>
              </h2>

              <p className="text-lg text-slate-300 font-medium leading-relaxed">
                Escolha seu plano agora e aproveite!
                <br className="hidden sm:block" />
                Comece em menos de 2 minutos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
              <a
                href="#planos"
                className="group relative inline-flex items-center gap-3 px-8 py-5 rounded-2xl text-slate-950 font-black text-sm uppercase tracking-widest bg-white hover:bg-slate-100 shadow-2xl shadow-black/40 transition-all active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-3">
                  <Lock size={18} />
                  QUERO TER ACESSO
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Zap size={16} fill="currentColor" className="text-emerald-400" />
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                  Acesso imediato
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
