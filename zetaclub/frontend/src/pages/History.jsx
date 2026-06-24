import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { History, Play, Eye, Clock, Search, ArrowLeft, Trash2 } from "lucide-react";
import { getAssetUrl } from "../utils/assets";
import Skeleton from "../components/Skeleton";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
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
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/videos/continue-watching?deviceId=${getDeviceId()}`);
        setHistory(res.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
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
            Meu <span className="text-primary-500">Histórico</span>
            <History size={32} className="text-primary-500" />
          </h1>
          <p className="text-slate-400 font-medium">Vídeos que você começou a assistir recentemente.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {Array(4).fill(0).map((_, i) => <VideoSkeleton key={i} />)}
        </div>
      ) : history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {history.map((item) => (
            <Link
              key={item.id}
              to={`/video/${item.video.id}`}
              className="group flex flex-col bg-transparent rounded-2xl transition-all duration-500"
            >
              <div className="aspect-video relative overflow-hidden rounded-[1.5rem] bg-slate-800 shadow-xl border border-white/5 group-hover:border-primary-500/30 transition-all duration-500">
                <img
                  src={getAssetUrl(item.video.thumbnailUrl) || "https://via.placeholder.com/640x360?text=Sem+Thumbnail"}
                  alt={item.video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                
                {/* Barra de Progresso */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-900/80">
                  <div 
                    className="h-full bg-primary-600 shadow-[0_0_10px_rgba(225,29,72,0.5)]" 
                    style={{ width: `${(item.currentTime / item.duration) * 100}%` }}
                  ></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-primary-600 p-5 rounded-full shadow-2xl shadow-primary-900/50 transform scale-50 group-hover:scale-100 transition-all duration-500">
                    <Play className="text-white ml-1" size={32} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="pt-5 px-1">
                <h3 className="font-black text-lg text-slate-100 mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors leading-[1.3]">
                  {item.video.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-primary-500/80" />
                      {Math.floor(item.currentTime / 60)}m assistidos
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-slate-800/20 rounded-[3rem] border border-dashed border-white/5">
          <div className="bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
            <History size={40} className="text-slate-600" />
          </div>
          <p className="text-2xl font-black text-slate-400 mb-3">Histórico vazio</p>
          <p className="text-slate-500 font-bold mb-10">Os vídeos que você assistir aparecerão aqui.</p>
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

export default WatchHistory;
