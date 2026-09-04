import React from 'react';
import { Lock, Play, ArrowRight, Image as ImageIcon } from 'lucide-react';

const PREVIEWS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  label: `PRÉVIA #${String(i + 1).padStart(2, '0')}`,
}));

const CATEGORIES = ['Premium', 'Exclusivo', 'HD', '4K', 'Novos', 'Destaque'];

const PreviewsSection = () => {
  return (
    <section id="previas" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <ImageIcon size={14} />
              Mostruário
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
              ALGUMAS <span className="bg-clip-text text-transparent bg-gradient-primary">PRÉVIAS</span> DO QUE TE ESPERA
            </h2>
          </div>

          <a
            href="#planos"
            className="group inline-flex items-center gap-2 self-start md:self-end px-5 py-3 rounded-xl text-sm font-black text-primary-400 hover:text-white border border-primary-500/20 hover:border-primary-500/40 hover:bg-primary-500/10 transition-all"
          >
            Ver mais prévias
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {PREVIEWS.map((item, idx) => (
            <div
              key={item.id}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 hover:border-primary-500/30 shadow-lg shadow-black/20 transition-all duration-500 cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br"
                style={{
                  backgroundImage: `linear-gradient(135deg, hsl(${270 + idx * 8}, 60%, 20%) 0%, hsl(${290 + idx * 6}, 55%, 12%) 50%, hsl(${320 + idx * 5}, 45%, 8%) 100%)`,
                }}
              />
              <div className="absolute inset-0 opacity-60 mix-blend-overlay">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 30% 20%, rgba(168,85,247,0.35), transparent 50%), radial-gradient(circle at 70% 80%, rgba(236,72,153,0.25), transparent 50%)',
                  }}
                />
              </div>

              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-40 scale-150 group-hover:opacity-60 transition-opacity" />
                  <div className="relative w-16 h-16 rounded-full bg-slate-950/70 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Lock size={28} className="text-primary-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-gradient-primary/20 group-hover:border-primary-500/30 transition-all">
                  <Play size={12} fill="currentColor" className="text-primary-400" />
                  <span className="text-[10px] font-black text-white tracking-widest">{item.label}</span>
                </div>
              </div>

              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                  {CATEGORIES[idx] || 'Premium'}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />

              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10">
                <span className="text-[9px] font-black text-slate-400">🔒 BLOQUEADO</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-slate-400 font-medium">
            As prévias são apenas uma pequena amostra.
          </p>
          <p className="font-black">
            <a href="#planos" className="text-primary-400 hover:text-primary-300 transition-colors">
              Assine um plano e desbloqueie o conteúdo completo.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PreviewsSection;
