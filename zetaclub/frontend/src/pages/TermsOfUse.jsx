import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link to="/" className="text-primary-500 font-bold mb-8 inline-block hover:text-primary-400 transition-colors">← Voltar para a Página Inicial</Link>
      <h1 className="text-4xl font-black mb-8 text-white">Termos de Uso</h1>
      <div className="space-y-6 text-slate-300">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
          <p>Ao acessar e usar este site, você aceita e concorda em ficar vinculado aos termos e condições deste acordo.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Idade Mínima</h2>
          <p>Você deve ter pelo menos 18 anos de idade para usar este serviço.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Uso do Serviço</h2>
          <p>Este serviço é fornecido para uso pessoal e não-comercial.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Conteúdo</h2>
          <p>Todo o conteúdo disponibilizado no site é para fins de entretenimento.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUse;
