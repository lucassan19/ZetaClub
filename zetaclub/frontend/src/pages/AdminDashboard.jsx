import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Video, Eye, Calendar, TrendingUp, Award, Layers, 
  ArrowUpRight, Clock, Plus, Edit, Trash2, CheckCircle, X, Upload, Loader2
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories first as they are critical for the form
      try {
        const cRes = await api.get('/categories');
        setCategories(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }

      // Fetch videos and stats
      try {
        const [vRes, sRes] = await Promise.all([
          api.get('/videos?limit=100'),
          api.get('/videos/admin/stats')
        ]);
        setVideos(vRes.data.videos);
        setStats(sRes.data);
      } catch (err) {
        console.error('Error fetching videos/stats:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name: newCategoryName });
      setNewCategoryName('');
      
      // Just refresh categories list quickly
      const cRes = await api.get('/categories');
      setCategories(Array.isArray(cRes.data) ? cRes.data : []);
      
      // Also refresh stats in background
      api.get('/videos/admin/stats').then(sRes => setStats(sRes.data)).catch(console.error);
      
      setMessage({ type: 'success', text: 'Categoria criada!' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao criar categoria';
      setMessage({ type: 'error', text: errorMsg });
      console.error('Erro na categoria:', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Tem certeza? Isso pode afetar vídeos vinculados.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchData();
    } catch (err) {
      alert('Erro ao excluir categoria');
    }
  };

  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('categoryId', categoryId);
    if (videoFile) formData.append('video', videoFile);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

    try {
      if (editingVideo) {
        await api.put(`/videos/${editingVideo.id}`, formData);
        setMessage({ type: 'success', text: 'Vídeo atualizado com sucesso!' });
      } else {
        await api.post('/videos', formData);
        setMessage({ type: 'success', text: 'Vídeo enviado e em processamento!' });
      }
      resetForm();
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao processar vídeo';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Excluir este vídeo permanentemente?')) return;
    try {
      await api.delete(`/videos/${id}`);
      fetchData();
      setMessage({ type: 'success', text: 'Vídeo removido' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao remover vídeo' });
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategoryId('');
    setVideoFile(null);
    setThumbnailFile(null);
    setEditingVideo(null);
  };

  const openEditModal = (video) => {
    setEditingVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setCategoryId(video.categoryId);
    setIsModalOpen(true);
  };

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Painel Administrativo</h1>
          <p className="text-slate-400">Gerencie seus vídeos e acompanhe o crescimento do ZetaClub.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-primary-900/20 active:scale-95"
        >
          <Plus size={20} />
          Novo Vídeo
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-2 ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          <span className="font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Vídeos" value={stats?.totalVideos} icon={<Video />} color="bg-blue-500" />
        <StatCard title="Total de Views" value={stats?.totalViews?.toLocaleString()} icon={<Eye />} color="bg-indigo-500" />
        <StatCard title="Views Hoje" value={stats?.viewsToday} icon={<TrendingUp />} color="bg-emerald-500" trend="+12%" />
        <StatCard title="Últimos 7 Dias" value={stats?.viewsLast7Days} icon={<Calendar />} color="bg-amber-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl shadow-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-400" />
            Visualizações Diárias (7 dias)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.dailyViews || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl shadow-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Layers size={20} className="text-primary-400" />
            Views por Categoria
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.viewsByCategory || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                />
                <Bar dataKey="totalViews" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories Manager */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layers size={20} className="text-primary-400" />
              Categorias
            </h2>
            <form onSubmit={handleCreateCategory} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Nova categoria..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none transition"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
              <button type="submit" className="bg-primary-600 hover:bg-primary-500 p-2 rounded-xl transition shadow-lg shadow-primary-900/20">
                <Plus size={24} />
              </button>
            </form>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {categories.length === 0 ? (
                <p className="text-slate-500 text-sm italic text-center py-4">Nenhuma categoria criada.</p>
              ) : (
                categories.map(cat => (
                  <div key={cat.id} className="bg-slate-900/50 border border-slate-700 px-4 py-2 rounded-xl flex items-center justify-between group">
                    <span className="font-medium">{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-500 hover:text-red-500 transition p-1">
                      <X size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Award size={20} className="text-amber-400" />
              Top 5 Vídeos
            </h2>
            <div className="space-y-4">
              {stats?.topVideos?.slice(0, 5).map((v, i) => (
                <div key={v.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    i === 0 ? 'bg-amber-500 text-amber-950' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{v.title}</p>
                    <p className="text-xs text-slate-500">{v.views?.toLocaleString()} views</p>
                  </div>
                  <div className="text-primary-400">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Videos Table */}
        <div className="lg:col-span-2">
          <section className="bg-slate-800/50 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Video size={20} className="text-primary-400" />
                Biblioteca de Vídeos
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Vídeo</th>
                    <th className="px-6 py-4 text-center">Views</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {videos.map(video => (
                    <tr key={video.id} className="hover:bg-slate-700/20 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={video.thumbnailUrl ? `http://localhost:5000${video.thumbnailUrl}` : 'https://via.placeholder.com/100x60'} 
                            className="w-16 h-10 object-cover rounded-lg border border-slate-700"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate text-sm">{video.title}</p>
                            <p className="text-xs text-slate-500">{video.Category?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-mono text-primary-400">{video.views?.toLocaleString() || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          video.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                          video.status === 'processing' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                          'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {video.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEditModal(video)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDeleteVideo(video.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Modal for Upload/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingVideo ? 'Editar Vídeo' : 'Novo Upload'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitVideo} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-400 uppercase tracking-wider">Título</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-400 uppercase tracking-wider">Categoria</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                    >
                      <option value="">Selecione...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-red-500 text-[10px] mt-1 italic">Crie uma categoria primeiro!</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-400 uppercase tracking-wider">Descrição</label>
                  <textarea
                    rows="5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none transition resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-400 uppercase tracking-wider">Vídeo</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 transition group">
                    <Upload className="text-slate-500 mb-2 group-hover:text-primary-500 transition" size={32} />
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 font-medium">
                      {videoFile ? videoFile.name : 'Clique para selecionar'}
                    </span>
                    <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="hidden" required={!editingVideo} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-400 uppercase tracking-wider">Thumbnail</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 transition group">
                    <Upload className="text-slate-500 mb-2 group-hover:text-primary-500 transition" size={32} />
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 font-medium">
                      {thumbnailFile ? thumbnailFile.name : 'Clique para selecionar'}
                    </span>
                    <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="bg-primary-600 hover:bg-primary-500 px-10 py-3 rounded-2xl font-bold text-white transition shadow-lg shadow-primary-900/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      {editingVideo ? 'Salvar' : 'Enviar'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl shadow-xl group hover:border-primary-500/30 transition">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-20 text-white group-hover:scale-110 transition duration-300`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
          <ArrowUpRight size={12} />
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
    <p className="text-3xl font-black text-white">{value || 0}</p>
  </div>
);

export default AdminDashboard;
