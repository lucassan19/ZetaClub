import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Play, Calendar, Tag, Eye, Clock, Search, Filter, TrendingUp, Heart, X, Loader2 } from "lucide-react";
import { getAssetUrl } from "../utils/assets";
import Skeleton from "../components/Skeleton";

// Hook de Debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("categoryId") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "latest");
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const limit = 12;

  // Atualizar URL quando filtros mudam
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory) params.categoryId = selectedCategory;
    if (sortBy !== "latest") params.sort = sortBy;
    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, sortBy]);

  // Buscar dados quando filtros mudam
  useEffect(() => {
    setPage(0);
    fetchData(0, true);
  }, [debouncedSearch, selectedCategory, sortBy]);

  const fetchData = async (currentPage, isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const [videosRes, categoriesRes] = await Promise.all([
        api.get(
          `/videos?search=${debouncedSearch}&categoryId=${selectedCategory}&sort=${sortBy}&limit=${limit}&offset=${currentPage * limit}`,
        ),
        api.get("/categories"),
      ]);

      console.log("📡 API Response /videos:", videosRes.data);
      console.log("📡 API Response /categories:", categoriesRes.data);

      const newVideos = Array.isArray(videosRes.data?.videos) 
        ? videosRes.data.videos 
        : (Array.isArray(videosRes.data) ? videosRes.data : []);
        
      console.log("✅ newVideos to render:", newVideos);
        
      if (isNewSearch) {
        setVideos(newVideos);
      } else {
        setVideos((prev) => [...prev, ...newVideos]);
      }

      setTotalVideos(videosRes.data?.count || 0);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  };

  const VideoSkeleton = () => (
    <div className="bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-700/50">
      <div className="aspect-video w-full bg-slate-700/50 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
      <div className="p-5 space-y-4">
        <div className="h-5 bg-slate-700/50 rounded-lg w-3/4 animate-pulse"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-slate-700/50 rounded-lg w-1/4 animate-pulse"></div>
          <div className="h-3 bg-slate-700/50 rounded-lg w-1/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Hero Section */}
      {!debouncedSearch && !selectedCategory && (
        <div className="mb-12 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-primary-600/20 via-slate-800/50 to-slate-900 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-black uppercase tracking-widest mb-6">
              <TrendingUp size={14} />
              Plataforma Premium
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-500 tracking-tight">
              A nova era do <br />
              <span className="text-primary-500">porno</span> exclusivo.
            </h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
              {/* Acesse os melhores vídeos pornos com qualidade Ultra HD, navegação inteligente e experiência imersiva feita para você. */}
            </p>
            <div className="flex flex-wrap gap-4">
              {/* <button className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-900/20 hover:scale-105 active:scale-95">
                Começar a assistir
              </button> */}
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[30rem] h-[30rem] bg-primary-600/10 rounded-full blur-[120px] group-hover:bg-primary-600/20 transition-all duration-1000"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]"></div>
        </div>
      )}

      {/* Toolbar: Search, Categories & Sort */}
      <div className="space-y-8 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <input
              type="text"
              placeholder="Pesquisar vídeos..."
              className="w-full bg-slate-800/40 border border-white/5 rounded-2xl py-4 px-14 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-slate-800 transition-all placeholder:text-slate-500 font-bold text-white group-hover:border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-5 top-4 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={22} />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-5 top-4 text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <div className="flex items-center gap-2 mr-2 text-slate-500 shrink-0">
              <Filter size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Ordenar:</span>
            </div>
            {[
              { id: 'latest', label: 'Recentes', icon: Clock },
              { id: 'views', label: 'Mais Vistos', icon: Eye },
              { id: 'likes', label: 'Mais Curtidos', icon: Heart }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap font-bold text-sm transition-all border ${
                  sortBy === option.id
                    ? "bg-white text-slate-900 border-white shadow-xl"
                    : "bg-slate-800/40 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <option.icon size={16} />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-6 py-3 rounded-xl whitespace-nowrap font-black text-xs uppercase tracking-widest transition-all border ${
              selectedCategory === ""
                ? "bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-900/20"
                : "bg-slate-800/40 text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300"
            }`}
          >
            Todos os vídeos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl whitespace-nowrap font-black text-xs uppercase tracking-widest transition-all border ${
                selectedCategory == cat.id
                  ? "bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-900/20"
                  : "bg-slate-800/40 text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      {(debouncedSearch || selectedCategory) && (
        <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
          <h2 className="text-2xl font-black text-white flex items-center gap-4">
            {debouncedSearch ? (
              <>
                <span className="text-slate-500 font-medium">Resultados para:</span>
                <span className="px-4 py-1 bg-slate-800 rounded-lg border border-white/5">"{debouncedSearch}"</span>
              </>
            ) : (
              categories.find((c) => c.id == selectedCategory)?.name
            )}
            <span className="px-3 py-1 bg-primary-500/10 text-primary-500 text-xs rounded-full border border-primary-500/20">
              {totalVideos} vídeos
            </span>
          </h2>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {loading ? (
          Array(8).fill(0).map((_, i) => <VideoSkeleton key={i} />)
        ) : videos.length > 0 ? (
          videos.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.id}`}
              className="group flex flex-col bg-transparent rounded-2xl transition-all duration-500"
            >
              <div className="aspect-video relative overflow-hidden rounded-[1.5rem] bg-slate-800 shadow-xl border border-white/5 group-hover:border-primary-500/30 transition-all duration-500">
                <img
                  src={getAssetUrl(video.thumbnailUrl) || "https://via.placeholder.com/640x360?text=Sem+Thumbnail"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  loading="lazy"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-primary-600 p-5 rounded-full shadow-2xl shadow-primary-900/50 transform scale-50 group-hover:scale-100 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)">
                    <Play className="text-white ml-1" size={32} fill="currentColor" />
                  </div>
                </div>

                {/* Duration / Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                    {video.Category?.name || "Geral"}
                  </span>
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-md border border-white/5">
                    HD
                  </span>
                </div>
              </div>

              <div className="pt-5 px-1">
                <h3 className="font-black text-lg text-slate-100 mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors leading-[1.3]">
                  {video.title}
                </h3>
                <div className="flex items-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 group-hover:text-slate-300 transition-colors">
                    <Eye size={14} className="text-primary-500/80" />
                    {video.views?.toLocaleString() || 0}
                  </div>
                  <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                  <div className="flex items-center gap-1.5 group-hover:text-slate-300 transition-colors">
                    <Clock size={14} className="text-primary-500/80" />
                    {new Date(video.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-32 bg-slate-800/20 rounded-[3rem] border border-dashed border-white/5 animate-in fade-in zoom-in-95 duration-700">
            <div className="bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
              <Search size={40} className="text-slate-600" />
            </div>
            <p className="text-2xl font-black text-slate-400 mb-3">Nenhum vídeo encontrado</p>
            <p className="text-slate-500 font-bold mb-10">Tente ajustar seus termos de pesquisa ou filtros.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategory(""); setSortBy("latest"); }}
              className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalVideos > videos.length && (
        <div className="mt-20 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-slate-800/50 hover:bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all border border-white/5 hover:border-white/10 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 via-primary-600/10 to-primary-600/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            {loadingMore ? (
              <>
                <Loader2 size={20} className="animate-spin text-primary-500" />
                <span>Carregando...</span>
              </>
            ) : (
              <>
                <span>Carregar mais conteúdos</span>
                <Play size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
