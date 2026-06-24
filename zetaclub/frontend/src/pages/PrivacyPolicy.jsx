import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link to="/" className="text-primary-500 font-bold mb-8 inline-block hover:text-primary-400 transition-colors">← Voltar para a Página Inicial</Link>
      <h1 className="text-4xl font-black mb-8 text-white">Política de Privacidade</h1>
      <div className="space-y-6 text-slate-300">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Coleta de Dados</h2>
          <p>Coletamos informações mínimas necessárias para a operação do serviço.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Uso dos Dados</h2>
          <p>Os dados coletados são usados apenas para a funcionalidade do serviço.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Armazenamento</h2>
          <p>Seus dados são armazenados de forma segura.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
