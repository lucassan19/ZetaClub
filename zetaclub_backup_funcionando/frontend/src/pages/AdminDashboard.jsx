import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';
import { 
  Video, Eye, Calendar, TrendingUp, Layers, 
  Plus, Edit, Trash2, CheckCircle, X, Upload, Loader2, Search, Filter, AlertCircle
} from 'lucide-react';
import { getAssetUrl } from '../utils/assets';
import Skeleton from '../components/Skeleton';

const AdminDashboard = () => {
  console.log('--- RENDERING ADMIN DASHBOARD ---');
  
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    console.log('AdminDashboard Mounted - fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Calling API endpoints...');
      const [cRes, vRes, sRes] = await Promise.all([
        api.get('/categories').catch(e => { console.error('API Error /categories:', e); return { data: [] }; }),
        api.get('/videos?limit=1000').catch(e => { console.error('API Error /videos:', e); return { data: { videos: [], count: 0 } }; }),
        api.get('/videos/admin/stats').catch(e => { console.error('API Error /admin/stats:', e); return { data: null }; })
      ]);

      console.log('API Responses received:', { 
        categories: cRes?.data, 
        videos: vRes?.data, 
        stats: sRes?.data 
      });

      setCategories(Array.isArray(cRes?.data) ? cRes.data : []);
      setVideos(vRes?.data?.videos || (Array.isArray(vRes?.data) ? vRes.data : []));
      setStats(sRes?.data || {
        totalVideos: 0,
        totalViews: 0,
        viewsToday: 0,
        dailyViews: [],
        viewsByCategory: []
      });
      
    } catch (err) {
      console.error('CRITICAL ERROR in AdminDashboard fetchData:', err);
      setError('Falha crítica ao conectar com o servidor. Verifique se o backend está rodando na porta 5001.');
    } finally {
      setLoading(false);
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

  const filteredVideos = Array.isArray(videos) 
    ? videos.filter(v => v?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse p-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-12 max-w-xl mx-auto">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white mb-4">Erro no Dashboard</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-white text-black font-black px-8 py-3 rounded-2xl hover:bg-slate-200 transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            Controle do <span className="text-primary-500">67videos</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">Visão geral do sistema e gerenciamento de conteúdo.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="group flex items-center gap-3 bg-primary-600 hover:bg-primary-500 px-8 py-4 rounded-2xl font-black text-white transition-all shadow-xl shadow-primary-900/20 active:scale-95"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          ADICIONAR NOVO VÍDEO
        </button>
      </div>

      {message && (
        <div className={`p-5 rounded-2xl flex items-center gap-4 border backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={24} /> : <X size={24} />}
          <span className="font-bold flex-1">{message.text}</span>
          <button onClick={() => setMessage(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Vídeos Publicados" value={stats?.totalVideos} icon={<Video />} color="from-blue-600 to-indigo-600" />
        <StatCard title="Total de Visualizações" value={stats?.totalViews?.toLocaleString()} icon={<Eye />} color="from-indigo-600 to-violet-600" />
        <StatCard title="Views nas últimas 24h" value={stats?.viewsToday} icon={<TrendingUp />} color="from-emerald-600 to-teal-600" trend="+12%" />
        <StatCard title="Categorias Ativas" value={categories?.length} icon={<Layers />} color="from-amber-600 to-orange-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
          <h3 className="text-lg font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
            <TrendingUp size={20} className="text-primary-500" />
            Engajamento Semanal
          </h3>
          <div className="h-72 w-full">
            {stats?.dailyViews && Array.isArray(stats.dailyViews) && stats.dailyViews.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={10} 
                    fontWeight="bold"
                    tickFormatter={(val) => {
                      try { return new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }); }
                      catch (e) { return val || ''; }
                    }} 
                  />
                  <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#0ea5e9" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 3, stroke: '#0f172a' }} 
                    activeDot={{ r: 8, strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-bold italic">Sem dados de acesso recentes</div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
          <h3 className="text-lg font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
            <Layers size={20} className="text-primary-500" />
            Performance por Categoria
          </h3>
          <div className="h-72 w-full">
            {stats?.viewsByCategory && Array.isArray(stats.viewsByCategory) && stats.viewsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.viewsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" />
                  <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="totalViews" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-bold italic">Sem dados de categorias</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Management Table */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-xl font-black text-white">Gerenciar Biblioteca</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Pesquisar vídeo..." 
                  className="bg-slate-900/50 border border-white/10 rounded-xl py-2 px-10 focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-full md:w-64 text-sm font-medium text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
                  <th className="px-8 py-5">Vídeo</th>
                  <th className="px-8 py-5 text-center">Visualizações</th>
                  <th className="px-8 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredVideos.length > 0 ? filteredVideos.map((v) => (
                  <tr key={v?.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-20 aspect-video rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/5">
                          <img src={getAssetUrl(v?.thumbnailUrl)} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200 line-clamp-1 group-hover:text-primary-400 transition-colors">{v?.title}</span>
                            {v?.status === 'processing' && <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase rounded border border-amber-500/20">Processando</span>}
                            {v?.status === 'failed' && <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase rounded border border-red-500/20">Falhou</span>}
                            {v?.status === 'ready' && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded border border-emerald-500/20">OK</span>}
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{v?.Category?.name || 'Sem Categoria'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center font-bold text-slate-400">{v?.views?.toLocaleString() || 0}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(v)}
                          className="p-2.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition-all border border-indigo-500/20"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteVideo(v?.id)}
                          className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center text-slate-500 font-bold italic">Nenhum vídeo encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories Manager */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
              <Layers size={20} className="text-primary-500" />
              Categorias
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api.post('/categories', { name: newCategoryName });
                setNewCategoryName('');
                fetchData();
                setMessage({ type: 'success', text: 'Categoria criada!' });
              } catch (err) {
                setMessage({ type: 'error', text: 'Erro ao criar categoria' });
              }
            }} className="flex gap-2 mb-8">
              <input 
                type="text" 
                placeholder="Nova categoria..." 
                className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm font-bold text-white"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
              <button type="submit" className="bg-primary-600 hover:bg-primary-500 p-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary-900/20">
                <Plus size={20} />
              </button>
            </form>

            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat?.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-2xl border border-white/5 group hover:border-primary-500/30 transition-all">
                  <span className="font-bold text-slate-300">{cat?.name}</span>
                  <button 
                    onClick={async () => {
                      if (!window.confirm('Excluir categoria?')) return;
                      try {
                        await api.delete(`/categories/${cat?.id}`);
                        fetchData();
                        setMessage({ type: 'success', text: 'Categoria excluída!' });
                      } catch (err) {
                        setMessage({ type: 'error', text: 'Erro ao excluir categoria' });
                      }
                    }}
                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {categories.length === 0 && <div className="text-center text-slate-600 py-4 italic">Sem categorias cadastradas</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Unified for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-white">
                  {editingVideo ? 'Editar Conteúdo' : 'Novo Conteúdo'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmitVideo} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Título do Vídeo</label>
                    <input 
                      type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-white"
                      placeholder="Ex: Título impactante do vídeo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Categoria</label>
                    <select 
                      value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold appearance-none text-white"
                    >
                      <option value="">Selecione uma categoria...</option>
                      {categories.map(c => <option key={c?.id} value={c?.id}>{c?.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Descrição</label>
                    <textarea 
                      value={description} onChange={(e) => setDescription(e.target.value)} rows="4"
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-white"
                      placeholder="Fale um pouco sobre o conteúdo..."
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Arquivos de Mídia</label>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative group">
                        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="hidden" id="video-upload" />
                        <label htmlFor="video-upload" className="flex flex-col items-center justify-center p-8 bg-slate-800/50 border-2 border-dashed border-white/10 rounded-3xl hover:border-primary-500/50 hover:bg-primary-500/5 transition-all cursor-pointer group">
                          <Upload className="text-slate-500 group-hover:text-primary-500 mb-3 transition-colors" size={32} />
                          <span className="text-sm font-bold text-slate-300">
                            {videoFile ? videoFile.name : 'Selecionar Vídeo (MP4)'}
                          </span>
                        </label>
                      </div>

                      <div className="relative group">
                        <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} className="hidden" id="thumb-upload" />
                        <label htmlFor="thumb-upload" className="flex flex-col items-center justify-center p-8 bg-slate-800/50 border-2 border-dashed border-white/10 rounded-3xl hover:border-primary-500/50 hover:bg-primary-500/5 transition-all cursor-pointer group">
                          <Upload className="text-slate-500 group-hover:text-primary-500 mb-3 transition-colors" size={32} />
                          <span className="text-sm font-bold text-slate-300">
                            {thumbnailFile ? thumbnailFile.name : 'Selecionar Thumbnail (JPG/PNG)'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit" disabled={uploadLoading}
                      className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary-900/20 flex items-center justify-center gap-3"
                    >
                      {uploadLoading ? <Loader2 className="animate-spin" size={24} /> : editingVideo ? <CheckCircle size={24} /> : <Plus size={24} />}
                      {uploadLoading ? 'PROCESSANDO...' : editingVideo ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR VÍDEO AGORA'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className={`relative overflow-hidden bg-slate-800/40 border border-white/5 p-8 rounded-[2rem] shadow-xl group hover:scale-[1.02] transition-all duration-300`}>
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
    <div className="relative z-10 flex items-center justify-between mb-4">
      <div className={`p-3 bg-slate-900 rounded-2xl border border-white/5 text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all`}>
        {icon}
      </div>
      {trend && (
        <span className="text-emerald-500 text-xs font-black bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
          {trend}
        </span>
      )}
    </div>
    <div className="relative z-10">
      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">{title}</h4>
      <p className="text-3xl font-black text-white">{value !== undefined && value !== null ? value : 0}</p>
    </div>
  </div>
);

export default AdminDashboard;
