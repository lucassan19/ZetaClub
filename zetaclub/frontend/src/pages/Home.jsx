import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Play, Calendar, Tag, Eye } from 'lucide-react';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const limit = 12;

  useEffect(() => {
    setPage(0);
    setVideos([]);
    fetchData(0, true);
  }, [search, selectedCategory]);

  const fetchData = async (currentPage, isNewSearch = false) => {
    try {
      if (isNewSearch) setLoading(true);
      const [videosRes, categoriesRes] = await Promise.all([
        api.get(`/videos?search=${search}&categoryId=${selectedCategory}&limit=${limit}&offset=${currentPage * limit}`),
        api.get('/categories')
      ]);
      
      if (isNewSearch) {
        setVideos(videosRes.data.videos);
      } else {
        setVideos(prev => [...prev, ...videosRes.data.videos]);
      }
      
      setTotalVideos(videosRes.data.count);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  };

  return (
    <div>
      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
            selectedCategory === '' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              selectedCategory == cat.id ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(video => (
            <Link 
              key={video.id} 
              to={`/video/${video.id}`}
              className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-primary-500/50 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={video.thumbnailUrl ? `http://localhost:5000${video.thumbnailUrl}` : 'https://via.placeholder.com/640x360?text=Sem+Thumbnail'} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Play className="text-white" size={48} fill="currentColor" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-400 transition">{video.title}</h3>
                <div className="flex flex-col gap-2 text-sm text-slate-400">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      {video.Category?.name || 'Sem Categoria'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {video.views?.toLocaleString() || 0}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(video.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
          <p className="text-xl text-slate-400">Nenhum vídeo encontrado.</p>
        </div>
      )}

      {/* Load More Button */}
      {videos.length < totalVideos && !loading && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl border border-slate-700 transition"
          >
            Carregar mais vídeos
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
