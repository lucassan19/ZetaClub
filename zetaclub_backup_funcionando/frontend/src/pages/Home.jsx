import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Play, Calendar, Tag, Eye, Clock, Search } from "lucide-react";
import { getAssetUrl } from "../utils/assets";
import Skeleton from "../components/Skeleton";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get("search") || "";
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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
      if (isNewSearch) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const [videosRes, categoriesRes] = await Promise.all([
        api.get(
          `/videos?search=${search}&categoryId=${selectedCategory}&limit=${limit}&offset=${currentPage * limit}`,
        ),
        api.get("/categories"),
      ]);

      if (isNewSearch) {
        setVideos(videosRes.data.videos);
      } else {
        setVideos((prev) => [...prev, ...videosRes.data.videos]);
      }

      setTotalVideos(videosRes.data.count);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section (Optional but adds professionalism) */}
      {!search && !selectedCategory && (
        <div className="mb-12 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary-900/40 to-slate-800 border border-primary-500/20 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Descubra conteúdos exclusivos no 67videos
            </h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              A melhor experiência de streaming com qualidade premium e
              navegação fluida.
            </p>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl group-hover:bg-primary-600/20 transition-all duration-700"></div>
        </div>
      )}

      {/* Categories Filter */}
      <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-6 py-2.5 rounded-full whitespace-nowrap font-bold transition-all duration-300 ${
            selectedCategory === ""
              ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700"
          }`}
        >
          Todos os vídeos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap font-bold transition-all duration-300 ${
              selectedCategory == cat.id
                ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results Header */}
      {(search || selectedCategory) && (
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-200">
            {search
              ? `Resultados para "${search}"`
              : categories.find((c) => c.id == selectedCategory)?.name}
            <span className="ml-3 text-sm font-normal text-slate-500">
              ({totalVideos} vídeos)
            </span>
          </h2>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, i) => <VideoSkeleton key={i} />)
        ) : videos.length > 0 ? (
          videos.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.id}`}
              className="group flex flex-col bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-primary-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-900/10"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-900">
                <img
                  src={
                    getAssetUrl(video.thumbnailUrl) ||
                    "https://via.placeholder.com/640x360?text=Sem+Thumbnail"
                  }
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-primary-600 p-4 rounded-full shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <Play
                      className="text-white ml-1"
                      size={28}
                      fill="currentColor"
                    />
                  </div>
                </div>
                {/* Badge de Categoria */}
                <div className="absolute top-3 left-3">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-md border border-white/10">
                    {video.Category?.name || "Geral"}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors leading-tight">
                  {video.title}
                </h3>
                <div className="mt-auto flex items-center justify-between text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <Eye size={14} className="text-primary-500/70" />
                      {video.views?.toLocaleString() || 0}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-primary-500/70" />
                      {new Date(video.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-32 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
            <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-slate-600" />
            </div>
            <p className="text-xl font-bold text-slate-400 mb-2">
              Nenhum vídeo encontrado
            </p>
            <p className="text-slate-500">
              Tente ajustar seus filtros ou termos de pesquisa.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("");
                navigate("/");
              }}
              className="mt-6 text-primary-500 font-bold hover:text-primary-400 underline underline-offset-4"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}

        {/* Loading More Skeletons */}
        {loadingMore &&
          Array(4)
            .fill(0)
            .map((_, i) => <VideoSkeleton key={`more-${i}`} />)}
      </div>

      {/* Load More Button */}
      {videos.length < totalVideos && !loading && !loadingMore && (
        <div className="flex justify-center mt-16">
          <button
            onClick={handleLoadMore}
            className="group flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 px-10 rounded-2xl border border-slate-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
          >
            Ver mais vídeos
            <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <Play size={12} fill="currentColor" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
