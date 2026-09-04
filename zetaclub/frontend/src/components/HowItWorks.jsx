import React from 'react';
import { CreditCard, Unlock, Sparkles, Play } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Escolha seu plano',
    desc: 'Selecione o plano que melhor atende às suas necessidades.',
    icon: Sparkles,
  },
  {
    num: '02',
    title: 'Faça o pagamento',
    desc: 'Pagamento rápido, seguro e 100% discreto.',
    icon: CreditCard,
  },
  {
    num: '03',
    title: 'Acesse o conteúdo',
    desc: 'Acesso imediato e ilimitado a todo conteúdo do seu plano.',
    icon: Unlock,
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-accent-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Play size={14} fill="currentColor" />
            Passo a passo
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
            COMO <span className="bg-clip-text text-transparent bg-gradient-primary">FUNCIONA?</span>
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="hidden lg:block absolute left-0 right-0 top-28 h-1 mx-16">
            <div className="h-full bg-gradient-to-r from-primary-500/20 via-primary-500/60 to-primary-500/20 rounded-full" />
            <div className="absolute inset-0 h-full bg-gradient-primary rounded-full opacity-40 blur-md" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start relative">
            {STEPS.map(({ num, title, desc, icon: Icon }, idx) => (
              <div key={num} className="relative flex flex-col items-center text-center group">
                {idx === 1 && (
                  <div className="relative mb-8 -order-1 lg:order-none hidden lg:block">
                    <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-30 scale-150" />
                    <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl shadow-primary-900/30 rotate-3 animate-float">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                        <Play size={40} className="text-white ml-1 relative z-10" fill="currentColor" />
                        <div className="absolute top-3 right-4 w-3 h-3 rounded-full bg-white/30" />
                        <div className="absolute bottom-4 left-4 w-4 h-2 rounded-sm bg-white/20" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shadow-xl group-hover:border-primary-500/30 transition-all">
                    <div className="absolute -top-1 -right-1 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary-900/40 ring-4 ring-slate-950">
                      {num}
                    </div>
                    <Icon size={32} className="text-primary-400 group-hover:text-white transition-colors" />
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-white mb-3">{title}</h3>
                <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed max-w-xs">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
