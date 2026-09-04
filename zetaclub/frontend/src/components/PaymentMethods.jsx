import React from 'react';
import { ShieldCheck, CreditCard } from 'lucide-react';

const METHODS = [
  { name: 'VISA', variant: 'bold' },
  { name: 'MASTERCARD', variant: 'circles' },
  { name: 'PIX', variant: 'pix' },
  { name: 'PayPal', variant: 'pp' },
  { name: 'BOLETO', variant: 'bar' },
];

const MethodBadge = ({ name, variant }) => {
  if (variant === 'pix') {
    return (
      <div className="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 min-w-[96px] hover:bg-white/[0.08] hover:border-primary-500/20 transition-all">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center">
          <span className="text-[9px] font-black text-white">PIX</span>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pix</span>
      </div>
    );
  }
  if (variant === 'pp') {
    return (
      <div className="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 min-w-[96px] hover:bg-white/[0.08] hover:border-primary-500/20 transition-all">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <span className="text-[9px] font-black text-white">PP</span>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PayPal</span>
      </div>
    );
  }
  if (variant === 'circles') {
    return (
      <div className="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 min-w-[96px] hover:bg-white/[0.08] hover:border-primary-500/20 transition-all">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center">
          <div className="flex -space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-red-500 border border-slate-900" />
            <div className="w-6 h-6 rounded-full bg-amber-400 border border-slate-900 mix-blend-multiply" />
          </div>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{name}</span>
      </div>
    );
  }
  if (variant === 'bar') {
    return (
      <div className="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 min-w-[96px] hover:bg-white/[0.08] hover:border-primary-500/20 transition-all">
        <div className="w-9 h-9 rounded-lg bg-slate-700/80 flex flex-col justify-center gap-0.5 p-1.5 border border-white/10">
          <div className="h-1 bg-slate-400 rounded-full w-full" />
          <div className="h-1 bg-slate-500 rounded-full w-4/5" />
          <div className="h-1 bg-slate-400 rounded-full w-full" />
          <div className="h-1 bg-slate-500 rounded-full w-3/4" />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Boleto</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 min-w-[96px] hover:bg-white/[0.08] hover:border-primary-500/20 transition-all">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-sky-700 flex items-center justify-center">
        <span className="text-[10px] font-black text-white italic">{name}</span>
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{name}</span>
    </div>
  );
};

const PaymentMethods = () => {
  return (
    <section className="relative pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-primary-soft border border-white/10 backdrop-blur-sm p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={26} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-black text-white">
                  Pagamento 100% seguro
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  e processado por plataformas confiáveis
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-start md:justify-end gap-3">
              {METHODS.map((m) => (
                <MethodBadge key={m.name} {...m} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;
