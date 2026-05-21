import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciais inválidas');
    }
  };

  return (
    <div className="flex justify-center items-center py-20">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary-400">Acesso Administrativo</h2>
        
        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Usuário</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Senha</label>
            <div className="relative">
              <input
                type="password"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-primary-900/20"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
