import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'Como funciona o acesso?',
    a: 'Após a confirmação do pagamento, você recebe imediatamente um acesso por e-mail e pode começar a assistir a todo o conteúdo do plano escolhido. O acesso é ilimitado e pode ser feito de qualquer navegador, sem necessidade de instalar programas.',
  },
  {
    q: 'Quais formas de pagamento estão disponíveis?',
    a: 'Aceitamos todas as principais formas de pagamento: Cartão de Crédito (VISA, Mastercard e demais bandeiras), PIX com aprovação imediata, PayPal e Boleto Bancário (aprovação em até 3 dias úteis). Todas as transações são processadas com criptografia de ponta a ponta.',
  },
  {
    q: 'Posso acessar pelo celular?',
    a: 'Sim! A plataforma é 100% responsiva e funciona perfeitamente em celulares, tablets, computadores e smart TVs. Dependendo do plano escolhido, você pode acessar simultaneamente em até 2 ou 4 dispositivos diferentes.',
  },
  {
    q: 'O pagamento é seguro?',
    a: 'Absolutamente. Todo o processo de pagamento é realizado por plataformas homologadas e certificadas, com criptografia SSL de 256 bits. Não armazenamos dados de cartão de crédito em nossos servidores. Além disso, sua inscrição é totalmente discreta e não aparecerá identificada como 67Videos na sua fatura.',
  },
];

const FAQItem = ({ q, a, isOpen, onToggle }) => {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'bg-white/[0.04] border-primary-500/30 shadow-lg shadow-primary-900/20'
          : 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-900/60'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 md:px-8 md:py-6 text-left group"
      >
        <span className="font-black text-white text-sm md:text-base leading-relaxed flex-1">{q}</span>
        <div
          className={`p-2 rounded-xl shrink-0 transition-all ${
            isOpen
              ? 'bg-gradient-primary text-white rotate-180'
              : 'bg-slate-800/60 text-slate-400 group-hover:bg-slate-800 group-hover:text-white'
          }`}
        >
          <ChevronDown size={18} />
        </div>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 md:px-8 md:pb-8 -mt-1">
            <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed border-l-2 border-primary-500/40 pl-4">
              {a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="perguntas" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-[auto_1fr] gap-12 lg:gap-20 max-w-6xl mx-auto items-start">
          <div className="lg:sticky lg:top-28 space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <HelpCircle size={14} />
              Suporte
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              PERGUNTAS <br />
              <span className="bg-clip-text text-transparent bg-gradient-primary">FREQUENTES</span>
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              Respostas para as dúvidas mais comuns sobre a plataforma. Se não encontrar o que procura, entre em contato com nosso suporte.
            </p>

            <a
              href="#planos"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black text-primary-400 hover:text-white border border-primary-500/20 hover:border-primary-500/40 hover:bg-primary-500/10 transition-all"
            >
              VER TODAS AS PERGUNTAS
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="space-y-3 md:space-y-4 flex-1">
            {FAQS.map((item, idx) => (
              <FAQItem
                key={item.q}
                {...item}
                isOpen={idx === openIdx}
                onToggle={() => setOpenIdx(idx === openIdx ? -1 : idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
