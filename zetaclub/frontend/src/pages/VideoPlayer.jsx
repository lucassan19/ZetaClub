import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { 
  Play, Eye, Clock, ThumbsUp, ThumbsDown, ArrowLeft, Tag, 
  Share2, MessageSquare, ChevronDown, Check, X, Heart, History, BookmarkPlus, BookmarkCheck,
  Loader2, Info, TrendingUp
} from "lucide-react";
import Hls from "hls.js";
import { getAssetUrl } from "../utils/assets";
import Skeleton from "../components/Skeleton";

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  
  // Likes/Dislikes
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);

  // Favoritos
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [viewRegistered, setViewRegistered] = useState(false);

  // Device ID para persistência sem login
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const [videoRes, relatedRes, favRes, progRes, reactionRes] = await Promise.all([
          api.get(`/videos/${id}`),
          api.get(`/videos/${id}/related`),
          api.get(`/videos/${id}/favorite?deviceId=${getDeviceId()}`),
          api.get(`/videos/${id}/progress?deviceId=${getDeviceId()}`),
          api.get(`/videos/${id}/reaction?deviceId=${getDeviceId()}`)
        ]);

        setVideo(videoRes.data);
        setLikesCount(reactionRes.data.likes || 0);
        setDislikesCount(reactionRes.data.dislikes || 0);
        setLiked(reactionRes.data.type === 'like');
        setDisliked(reactionRes.data.type === 'dislike');
        setIsFavorited(favRes.data.favorited);
        setRelatedVideos(relatedRes.data);
        
        // Restaurar progresso se existir
        if (progRes.data.currentTime > 0 && videoRef.current) {
          videoRef.current.currentTime = progRes.data.currentTime;
        }

      } catch (error) {
        console.error("Error loading video:", error);
      } finally {
        setLoading(false);
        setLoadingRelated(false);
      }
    };

    loadVideo();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [id]);

  // Salvar progresso periodicamente
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const saveProgress = async () => {
      if (videoElement.currentTime > 0) {
        try {
          await api.post(`/videos/${id}/progress`, {
            deviceId: getDeviceId(),
            currentTime: videoElement.currentTime,
            duration: videoElement.duration
          });
        } catch (err) {
          console.error("Error saving progress:", err);
        }
      }
    };

    const interval = setInterval(saveProgress, 10000); // a cada 10s
    return () => clearInterval(interval);
  }, [id, video]);

  useEffect(() => {
    if (video && videoRef.current) {
      const videoElement = videoRef.current;
      const hlsUrl = getAssetUrl(video.hlsUrl);
      const mp4Url = getAssetUrl(video.videoUrl);

      // Prioridade: HLS -> MP4
      if (video.status === 'ready' && hlsUrl && Hls.isSupported()) {
        const hls = new Hls({
          capLevelToPlayerSize: true,
          autoStartLoad: true
        });
        hlsRef.current = hls;
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoElement);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsVideoLoading(false);
          if (!viewRegistered) {
            api.post(`/videos/${id}/view`).catch(err => console.error('Error counting view', err));
            setViewRegistered(true);
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
              case Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break;
              default: hls.destroy(); break;
            }
          }
        });
      } else if (mp4Url) {
        videoElement.src = mp4Url;
        videoElement.onloadeddata = () => {
          setIsVideoLoading(false);
          if (!viewRegistered) {
            api.post(`/videos/${id}/view`).catch(err => console.error('Error counting view', err));
            setViewRegistered(true);
          }
        };
      }
    }
  }, [video, id, viewRegistered]);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await api.post(`/videos/${id}/like`, { deviceId: getDeviceId() });
      setLikesCount(res.data.likes);
      setDislikesCount(res.data.dislikes);
      setLiked(res.data.type === 'like');
      setDisliked(res.data.type === 'dislike');
    } catch (err) {
      console.error("Error liking video:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    if (dislikeLoading) return;
    setDislikeLoading(true);
    try {
      const res = await api.post(`/videos/${id}/dislike`, { deviceId: getDeviceId() });
      setLikesCount(res.data.likes);
      setDislikesCount(res.data.dislikes);
      setLiked(res.data.type === 'like');
      setDisliked(res.data.type === 'dislike');
    } catch (err) {
      console.error("Error disliking video:", err);
    } finally {
      setDislikeLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      const res = await api.post(`/videos/${id}/favorite`, { deviceId: getDeviceId() });
      setIsFavorited(res.data.favorited);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading || !video) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="aspect-video w-full rounded-[2.5rem]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all group font-bold">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Voltar para a biblioteca</span>
          </Link>

          {/* Player Container */}
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 relative group ring-1 ring-white/10">
            {isVideoLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 backdrop-blur-xl">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary-500/10 border-t-primary-500 rounded-full animate-spin"></div>
                  <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500" size={32} fill="currentColor" />
                </div>
                <p className="mt-6 text-slate-400 font-black uppercase tracking-[0.3em] text-xs animate-pulse">
                  {video.status === 'processing' ? 'Transcodificando...' : 'Carregando Player...'}
                </p>
              </div>
            )}
            
            {video.status === 'failed' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
                <div className="bg-red-500/10 p-8 rounded-full mb-6 border border-red-500/20">
                  <X size={56} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Erro no processamento</h3>
                <p className="text-slate-400 font-medium">Não foi possível preparar este vídeo.</p>
              </div>
            )}

            <video 
              ref={videoRef}
              className="w-full aspect-video object-contain"
              controls
              controlsList="nodownload"
              poster={getAssetUrl(video.thumbnailUrl)}
              playsInline
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          {/* Video Info Card */}
          <div className="bg-slate-800/40 rounded-[2rem] border border-white/5 p-8 md:p-10 shadow-xl">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-1.5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary-900/20">
                    {video.Category?.name || "Geral"}
                  </span>
                  <div className="flex items-center gap-4 text-slate-500 text-xs font-black uppercase tracking-widest ml-2">
                    <span className="flex items-center gap-2">
                      <Eye size={16} className="text-primary-500/60" />
                      {video.views?.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={16} className="text-primary-500/60" />
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                  {video.title}
                </h1>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    disabled={likeLoading || liked}
                    className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border active:scale-95 ${
                      liked
                        ? "bg-primary-600 border-primary-500 text-white shadow-xl shadow-primary-900/40"
                        : "bg-slate-800/60 hover:bg-slate-700 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <ThumbsUp size={18} fill={liked ? "currentColor" : "none"} />
                    <span>Gostei</span>
                    <span className="opacity-60">{likesCount}</span>
                  </button>

                  <button
                    onClick={handleDislike}
                    disabled={dislikeLoading || disliked}
                    className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border active:scale-95 ${
                      disliked
                        ? "bg-red-600 border-red-500 text-white shadow-xl shadow-red-900/40"
                        : "bg-slate-800/60 hover:bg-slate-700 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <ThumbsDown size={18} fill={disliked ? "currentColor" : "none"} />
                    <span>Não gostei</span>
                    <span className="opacity-60">{dislikesCount}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
                    className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border active:scale-95 ${
                      isFavorited
                        ? "bg-white text-slate-900 border-white shadow-xl"
                        : "bg-slate-800/60 hover:bg-slate-700 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {isFavorited ? (
                      <>
                        <BookmarkCheck size={18} />
                        <span>Favoritado</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus size={18} />
                        <span>Favoritar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-900/40 rounded-2xl p-6 border border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                  <Info size={14} />
                  Sobre este vídeo
                </h3>
                <p className="text-slate-300 leading-relaxed font-medium">
                  {video.description || "Sem descrição disponível."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <h2 className="text-xl font-black uppercase tracking-[0.15em] text-slate-200 flex items-center gap-3 px-2">
            <TrendingUp size={22} className="text-primary-500" />
            Próximos Vídeos
          </h2>

          <div className="space-y-5">
            {loadingRelated ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex gap-5 animate-pulse">
                  <div className="w-44 aspect-video rounded-2xl bg-slate-800 shrink-0"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                    <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : relatedVideos.length > 0 ? (
              relatedVideos.map((item) => (
                <Link
                  key={item.id}
                  to={`/video/${item.id}`}
                  className="group flex gap-5 hover:bg-white/5 p-3 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/5"
                >
                  <div className="w-44 aspect-video relative overflow-hidden rounded-[1.25rem] bg-slate-900 shrink-0 shadow-lg border border-white/5 group-hover:border-primary-500/30 transition-all duration-300">
                    <img
                      src={getAssetUrl(item.thumbnailUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
                      <Play size={24} fill="currentColor" className="text-white transform scale-50 group-hover:scale-100 transition-all duration-300" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center py-1 overflow-hidden">
                    <h4 className="font-black text-sm text-slate-100 line-clamp-2 group-hover:text-primary-400 transition-colors leading-snug mb-2">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Eye size={12} className="text-primary-500/60" />
                        {item.views || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-slate-500 text-sm font-bold text-center py-10 italic">Nenhum vídeo relacionado encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
