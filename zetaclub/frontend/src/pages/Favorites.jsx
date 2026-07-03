import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Heart, Play, Eye, Clock, Search, ArrowLeft } from "lucide-react";
import { getAssetUrl } from "../utils/assets";
import Skeleton from "../components/Skeleton";

const Favorites = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/videos/favorites?deviceId=${getDeviceId()}`);
        setVideos(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

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
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all group font-bold mb-4">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-4xl font-black text-white flex items-center gap-4">
            Meus <span className="text-primary-500">Favoritos</span>
            <Heart size={32} className="text-primary-500" fill="currentColor" />
          </h1>
          <p className="text-slate-400 font-medium">Sua coleção particular de vídeos salvos.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {Array(4).fill(0).map((_, i) => <VideoSkeleton key={i} />)}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {videos.map((video) => (
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-primary-600 p-5 rounded-full shadow-2xl shadow-primary-900/50 transform scale-50 group-hover:scale-100 transition-all duration-500">
                    <Play className="text-white ml-1" size={32} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="pt-5 px-1">
                <h3 className="font-black text-lg text-slate-100 mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors leading-[1.3]">
                  {video.title}
                </h3>
                <div className="flex items-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} className="text-primary-500/80" />
                    {video.views?.toLocaleString() || 0}
                  </div>
                  <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-primary-500/80" />
                    {new Date(video.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-slate-800/20 rounded-[3rem] border border-dashed border-white/5">
          <div className="bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
            <Heart size={40} className="text-slate-600" />
          </div>
          <p className="text-2xl font-black text-slate-400 mb-3">Você ainda não favoritou nada</p>
          <p className="text-slate-500 font-bold mb-10">Explore nossa biblioteca e salve seus vídeos preferidos.</p>
          <Link 
            to="/"
            className="inline-flex px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95"
          >
            Explorar Biblioteca
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
