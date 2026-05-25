import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Lock, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('Enviando tentativa de login para:', api.defaults.baseURL + '/auth/login');
      const res = await api.post('/auth/login', { username, password });
      console.log('Login bem sucedido!');
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Erro detalhado no login:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url
      });
      setError(err.response?.data?.message || 'Credenciais inválidas ou erro no servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-12 md:py-24 px-4">
      <div className="mb-10 text-center">
        <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-900/40 rotate-3">
          <ShieldCheck size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter">Zeta<span className="text-primary-500">Club</span> Admin</h1>
        <p className="text-slate-500 font-medium mt-2">Área restrita para gestão de conteúdo.</p>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-indigo-600"></div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-8 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Identificação</label>
            <div className="relative group">
              <input
                type="text"
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-12 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-slate-900 transition-all font-bold placeholder:text-slate-600"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Chave de Acesso</label>
            <div className="relative group">
              <input
                type="password"
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-12 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-slate-900 transition-all font-bold placeholder:text-slate-600"
                placeholder="Sua senha secreta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={20} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary-900/20 flex items-center justify-center gap-3 active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                ACESSAR PAINEL
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
      
      <p className="mt-12 text-slate-600 text-sm font-bold flex items-center gap-2">
        <ShieldCheck size={16} />
        Sistema de Segurança ZetaClub v2.0
      </p>
    </div>
  );
};

export default AdminLogin;
