import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Tag, ArrowLeft, Settings, Loader2, Eye, Clock, Share2, ThumbsUp, Play } from 'lucide-react';
import Hls from 'hls.js';
import { getAssetUrl } from '../utils/assets';
import Skeleton from '../components/Skeleton';

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [viewRegistered, setViewRegistered] = useState(false);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/videos/${id}`);
        setVideo(res.data);
        fetchRelated(res.data.id);
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (videoId) => {
      try {
        setLoadingRelated(true);
        const res = await api.get(`/videos/${videoId}/related`);
        setRelatedVideos(res.data);
      } catch (error) {
        console.error('Error fetching related videos:', error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchVideo();
    window.scrollTo(0, 0);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [id]);

  useEffect(() => {
    if (video && videoRef.current) {
      const videoElement = videoRef.current;
      const hlsUrl = getAssetUrl(video.hlsUrl);
      const mp4Url = getAssetUrl(video.videoUrl);

      // Prioridade: HLS (se pronto e disponível) -> MP4 (reprodução direta)
      if (video.status === 'ready' && hlsUrl && Hls.isSupported()) {
        const hls = new Hls({
          capLevelToPlayerSize: true,
          autoStartLoad: true
        });
        hlsRef.current = hls;
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoElement);
        
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          setQualityLevels(hls.levels);
          setIsVideoLoading(false);
          if (!viewRegistered) {
            api.post(`/videos/${id}/view`).catch(err => console.error('Error counting view', err));
            setViewRegistered(true);
          }
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          setCurrentQuality(data.level);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.status === 'ready' && hlsUrl && videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = hlsUrl;
        videoElement.addEventListener('loadedmetadata', () => {
          setIsVideoLoading(false);
        });
      } else if (mp4Url) {
        // Fallback MVP: Reprodução direta do MP4
        videoElement.src = mp4Url;
        videoElement.onloadeddata = () => {
          setIsVideoLoading(false);
          if (!viewRegistered) {
            api.post(`/videos/${id}/view`).catch(err => console.error('Error counting view', err));
            setViewRegistered(true);
          }
        };
      } else {
        setIsVideoLoading(false);
      }
    }
  }, [video]);

  const changeQuality = (levelIndex) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentQuality(levelIndex);
      setShowSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">Vídeo não encontrado</h2>
        <Link to="/" className="text-primary-500 hover:underline">Voltar para a home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition group mb-2">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Voltar para a biblioteca</span>
          </Link>

          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative group ring-1 ring-white/10">
            {isVideoLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                  <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500" size={24} fill="currentColor" />
                </div>
                <p className="mt-4 text-slate-400 font-bold animate-pulse">
                  {video.status === 'processing' ? 'Transcodificando vídeo...' : 'Carregando player...'}
                </p>
              </div>
            )}
            
            {video.status === 'failed' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm">
                <div className="bg-red-500/10 p-6 rounded-full mb-4">
                  <Loader2 size={48} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Erro no processamento</h3>
                <p className="text-slate-400">Não foi possível preparar este vídeo para streaming.</p>
              </div>
            )}

            <video 
              ref={videoRef}
              className="w-full aspect-video object-contain"
              controls
              poster={getAssetUrl(video.thumbnailUrl)}
            />

            {/* Quality Selector */}
            {qualityLevels.length > 0 && (
              <div className="absolute top-6 right-6 z-20">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-3 bg-black/60 hover:bg-primary-600 rounded-2xl text-white transition-all backdrop-blur-md border border-white/10 shadow-xl group"
                >
                  <Settings size={20} className={showSettings ? 'rotate-90 transition-transform' : 'transition-transform group-hover:rotate-45'} />
                </button>
                
                {showSettings && (
                  <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl py-3 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 mb-2">
                      Qualidade de Imagem
                    </div>
                    <button 
                      onClick={() => changeQuality(-1)}
                      className={`w-full text-left px-5 py-3 text-sm font-bold hover:bg-primary-600 transition-colors flex justify-between items-center ${currentQuality === -1 ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300'}`}
                    >
                      Automático (Auto)
                      {currentQuality === -1 && <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>}
                    </button>
                    {qualityLevels.map((level, index) => (
                      <button 
                        key={index}
                        onClick={() => changeQuality(index)}
                        className={`w-full text-left px-5 py-3 text-sm font-bold hover:bg-primary-600 transition-colors flex justify-between items-center ${currentQuality === index ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300'}`}
                      >
                        {level.height}p High Definition
                        {currentQuality === index && <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-primary-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                    {video.Category?.name || 'Geral'}
                  </span>
                  {video.status === 'processing' && (
                    <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-amber-500/20 flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" />
                      Transcodificando...
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{video.title}</h1>
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-bold">
                  <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
                    <Eye size={18} className="text-primary-500" />
                    <span className="text-white">{video.views?.toLocaleString()}</span>
                    <span className="text-slate-500 font-medium">visualizações</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
                    <Clock size={18} className="text-primary-500" />
                    <span className="text-white">{new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 px-5 py-2.5 rounded-xl transition-all font-bold text-sm border border-white/5">
                    <ThumbsUp size={18} />
                    Gostei
                  </button>
                  <button className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 px-5 py-2.5 rounded-xl transition-all font-bold text-sm border border-white/5">
                    <Share2 size={18} />
                    Compartilhar
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Descrição</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                  {video.description || 'Este vídeo não possui uma descrição detalhada.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Related Videos */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-200 flex items-center gap-3">
            <Tag size={20} className="text-primary-500" />
            Recomendados
          </h2>
          
          <div className="space-y-4">
            {loadingRelated ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-40 aspect-video rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : relatedVideos.length > 0 ? (
              relatedVideos.map(item => (
                <Link 
                  key={item.id} 
                  to={`/video/${item.id}`} 
                  className="group flex gap-4 hover:bg-slate-800/40 p-2 rounded-2xl transition-all border border-transparent hover:border-white/5"
                >
                  <div className="w-40 aspect-video relative overflow-hidden rounded-xl bg-slate-900 shrink-0">
                    <img 
                      src={getAssetUrl(item.thumbnailUrl)} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={20} fill="currentColor" className="text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center py-1 overflow-hidden">
                    <h4 className="font-bold text-sm text-slate-200 line-clamp-2 group-hover:text-primary-400 transition-colors leading-tight mb-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Eye size={10} />
                        {item.views?.toLocaleString()}
                      </span>
                      <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sem recomendações</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
