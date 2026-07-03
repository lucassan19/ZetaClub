import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link to="/" className="text-primary-500 font-bold mb-8 inline-block hover:text-primary-400 transition-colors">← Voltar para a Página Inicial</Link>
      <h1 className="text-4xl font-black mb-8 text-white">Contato</h1>
      <div className="space-y-6 text-slate-300">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Entre em Contato</h2>
          <p>Para dúvidas, sugestões ou questões legais, entre em contato conosco.</p>
          <p>Contato67videos@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default Contact;
