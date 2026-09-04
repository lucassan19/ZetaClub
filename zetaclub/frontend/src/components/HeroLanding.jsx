import React from 'react';
import { Lock, Shield, Infinity, Play, ChevronDown, Flame, ShieldCheck } from 'lucide-react';

const PILLS = [
  { icon: Lock, label: '100% Discreto', desc: 'Sua privacidade é nossa prioridade.' },
  { icon: Shield, label: 'HD · Alta Qualidade', desc: 'Vídeos e fotos em HD e Full HD.' },
  { icon: Infinity, label: 'Acesso Ilimitado', desc: 'Assista onde e quando quiser.' },
];

const HeroLanding = () => {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary-600/20 rounded-full blur-[160px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-accent-500/10 rounded-full blur-[140px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-20 md:pb-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-black uppercase tracking-widest">
              <Flame size={14} fill="currentColor" />
              Plataforma premium
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              CONTEÚDO <span className="text-white">EXCLUSIVO</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-primary">
                PARA QUEM QUER MAIS
              </span>
              <span className="inline-block ml-3">🔥</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
              Centenas de vídeos e fotos em alta qualidade,
              <br className="hidden sm:block" />
              novos conteúdos toda semana.
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              {PILLS.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="group p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary-500/20 hover:bg-white/[0.05] backdrop-blur-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-all">
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-black text-white">{label}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <a
                href="#planos"
                className="group relative inline-flex items-center gap-3 px-8 py-5 rounded-2xl text-white font-black text-sm uppercase tracking-widest bg-gradient-primary shadow-xl shadow-primary-900/40 hover:shadow-2xl hover:shadow-primary-900/50 transition-all active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  VER PLANOS E PRÉVIAS
                  <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                </span>
              </a>
              <div className="flex items-center gap-2 pl-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 border-2 border-slate-950 flex items-center justify-center text-[10px] font-black"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-black text-white">+10.000 assinantes</p>
                  <p className="text-xs text-slate-500 font-medium">já aproveitam o conteúdo</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 pt-2">
              <div className="p-1.5 rounded-md bg-primary-500/10 text-primary-400 border border-primary-500/20">
                <ShieldCheck size={14} />
              </div>
              <span className="text-xs font-bold">Conteúdo apenas para maiores de 18 anos.</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] max-w-md ml-auto">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary-600/30 via-accent-500/20 to-primary-700/30 blur-3xl" />
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-primary-900/30 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
                <div className="absolute inset-0 bg-gradient-primary-soft" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative animate-float">
                    <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-40 rounded-full scale-150" />
                    <div className="relative w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-2xl shadow-primary-900/40 ring-1 ring-white/20">
                      <Play size={56} className="text-white ml-2" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">Ao vivo</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
                    <p className="text-sm font-black text-white mb-1">Assista onde quiser</p>
                    <p className="text-xs text-slate-400 font-medium">Desktop · Mobile · Smart TV · Tablet</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-6 top-10 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl animate-float" style={{ animationDelay: '-2s' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Play size={20} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">+300 vídeos</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Atualizados</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-16 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl animate-float" style={{ animationDelay: '-4s' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
                    <Flame size={20} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">4.9★ Avaliação</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">2.341 reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroLanding;
