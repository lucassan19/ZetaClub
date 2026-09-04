import React from 'react';
import { ShieldCheck, Lock, Monitor, Headphones } from 'lucide-react';

const BADGES = [
  {
    icon: Lock,
    title: '100% Discreto',
    desc: 'Seus dados e atividades são sempre protegidos.',
  },
  {
    icon: ShieldCheck,
    title: 'Pagamento Seguro',
    desc: 'Ambiente seguro com criptografia avançada.',
  },
  {
    icon: Monitor,
    title: 'Acesso em vários dispositivos',
    desc: 'Assista no celular, tablet, computador ou smart TV.',
  },
  {
    icon: Headphones,
    title: 'Suporte Rápido',
    desc: 'Atendimento exclusivo para assinantes.',
  },
];

const TrustBadges = () => {
  return (
    <section className="relative py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {BADGES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-primary-500/20 hover:bg-slate-900/60 backdrop-blur-sm transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-full rounded-3xl bg-gradient-primary-soft opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative p-4 rounded-3xl bg-slate-800/80 border border-white/10 group-hover:bg-gradient-primary group-hover:border-transparent transition-all">
                    <Icon size={28} className="text-primary-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-base md:text-lg font-black text-white">{title}</h4>
                  <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
