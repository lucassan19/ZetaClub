import React from 'react';
import { Check, Star, Crown, Zap, Shield, Rocket, Sparkles } from 'lucide-react';

const PLANS = [
  {
    id: 'comum',
    name: 'COMUM',
    price: 39.9,
    period: '/mês',
    tagline: 'Acesso ao catálogo básico',
    badge: null,
    icon: Shield,
    features: [
      '+100 conteúdos',
      'Atualizações semanais',
      'Qualidade HD',
      'Acesso em 1 dispositivo',
    ],
    cta: 'ESCOLHER PLANO',
    highlight: false,
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 69.9,
    period: '/mês',
    tagline: 'Mais conteúdos e exclusividades',
    badge: 'MAIS ESCOLHIDO',
    icon: Crown,
    features: [
      '+300 conteúdos',
      'Conteúdos exclusivos',
      'Qualidade Full HD',
      'Acesso em 2 dispositivos',
      'Novos conteúdos primeiro',
    ],
    cta: 'ESCOLHER PLANO',
    highlight: true,
  },
  {
    id: 'extra',
    name: 'EXTRA PREMIUM',
    price: 99.9,
    period: '/mês',
    tagline: 'Acesso completo e sem limites',
    badge: null,
    icon: Rocket,
    features: [
      'Catálogo completo',
      'Conteúdos exclusivos',
      'Qualidade Full HD / 4K',
      'Acesso em até 4 dispositivos',
      'Downloads (quando disponível)',
      'Suporte prioritário',
    ],
    cta: 'ESCOLHER PLANO',
    highlight: false,
    accent: true,
  },
];

const PricingSection = () => {
  const handleSelectPlan = (planId) => {
    // Placeholder para futura integração com gateway
    console.log('Plano selecionado:', planId);
  };

  return (
    <section id="planos" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-primary-600/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            Assinatura
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
            ESCOLHA SEU <span className="bg-clip-text text-transparent bg-gradient-primary">PLANO</span>
          </h2>
          <p className="text-slate-400 font-medium text-lg">
            Simples, rápido e seguro. Escolha o plano ideal para você.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl p-8 md:p-10 transition-all duration-500 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-primary-950/60 via-slate-900/80 to-slate-900/60 border-2 border-primary-500/50 shadow-2xl shadow-primary-900/40 lg:-my-6 lg:scale-[1.02]'
                    : plan.accent
                    ? 'bg-gradient-to-b from-amber-950/30 via-slate-900/60 to-slate-900/40 border border-amber-500/30 shadow-xl shadow-black/30'
                    : 'bg-slate-900/50 border border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/30'
                } backdrop-blur-sm`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-primary shadow-lg shadow-primary-900/40">
                      <Star size={14} fill="currentColor" className="text-white" />
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.15em]">
                        {plan.badge}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`p-3 rounded-2xl ${
                      plan.highlight
                        ? 'bg-gradient-primary text-white shadow-lg shadow-primary-900/30'
                        : plan.accent
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-800/80 text-slate-300 border border-white/10'
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3
                    className={`text-xl font-black tracking-widest ${
                      plan.accent ? 'text-amber-400' : plan.highlight ? 'text-white' : 'text-slate-200'
                    }`}
                  >
                    {plan.name}
                  </h3>
                </div>

                <p className="text-sm text-slate-400 font-medium mb-6">{plan.tagline}</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-400">R$</span>
                    <span
                      className={`text-5xl lg:text-6xl font-black leading-none ${
                        plan.highlight ? 'text-white' : plan.accent ? 'text-amber-300' : 'text-slate-100'
                      }`}
                    >
                      {plan.price.toFixed(2).split('.')[0]}
                    </span>
                    <span
                      className={`text-2xl font-black ${
                        plan.highlight ? 'text-white' : plan.accent ? 'text-amber-300' : 'text-slate-100'
                      }`}
                    >
                      ,{plan.price.toFixed(2).split('.')[1]}
                    </span>
                    <span className="ml-1 text-sm text-slate-500 font-bold">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 p-0.5 rounded-md shrink-0 ${
                          plan.highlight
                            ? 'bg-primary-500/20 text-primary-400'
                            : plan.accent
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-primary-500/10 text-primary-500'
                        }`}
                      >
                        <Check size={14} />
                      </div>
                      <span className="text-sm text-slate-300 font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full group flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${
                    plan.highlight
                      ? 'bg-gradient-primary text-white shadow-xl shadow-primary-900/40 hover:shadow-2xl hover:shadow-primary-900/50 hover:opacity-95'
                      : plan.accent
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 shadow-lg shadow-amber-900/20'
                      : 'bg-slate-800/80 text-slate-200 border border-white/10 hover:bg-white/5 hover:border-primary-500/30 hover:text-white'
                  }`}
                >
                  <Zap size={16} fill={plan.highlight ? 'currentColor' : 'none'} />
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
