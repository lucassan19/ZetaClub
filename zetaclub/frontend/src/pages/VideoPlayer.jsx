import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Tag, ArrowLeft, Settings, Loader2, Eye } from 'lucide-react';
import Hls from 'hls.js';

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
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
        const res = await api.get(`/videos/${id}`);
        setVideo(res.data);
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [id]);

  useEffect(() => {
    if (video && videoRef.current) {
      const videoElement = videoRef.current;
      const hlsUrl = `http://localhost:5000${video.hlsUrl}`;
      const mp4Url = `http://localhost:5000${video.videoUrl}`;

      // Se o processamento HLS falhou ou ainda não terminou, usa o MP4 original
      if (video.status !== 'completed') {
        videoElement.src = mp4Url;
        setIsVideoLoading(false);
        
        if (!viewRegistered) {
          api.post(`/videos/${id}/view`).catch(err => console.error('Error counting view', err));
          setViewRegistered(true);
        }
        return;
      }

      if (Hls.isSupported()) {
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
          // Register view on manifest parsed (video ready to start)
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
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari which supports HLS natively
        videoElement.src = hlsUrl;
        videoElement.addEventListener('loadedmetadata', () => {
          setIsVideoLoading(false);
        });
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
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  if (!video) {
    return <div className="text-center text-xl text-slate-400">Vídeo não encontrado.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition">
        <ArrowLeft size={20} />
        Voltar para a biblioteca
      </Link>

      <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-8 border border-slate-800 relative group">
        {isVideoLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80">
            <Loader2 className="animate-spin text-primary-500 mb-4" size={64} />
            <p className="text-slate-300 font-medium">Preparando streaming adaptativo...</p>
          </div>
        )}
        
        <video 
          ref={videoRef}
          controls 
          className="w-full aspect-video"
          poster={video.thumbnailUrl ? `http://localhost:5000${video.thumbnailUrl}` : ''}
          preload="metadata"
        >
          Seu navegador não suporta a reprodução de vídeos.
        </video>

        {/* Quality Selector Overlay */}
        {qualityLevels.length > 0 && (
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition backdrop-blur-sm border border-white/10"
            >
              <Settings size={24} className={showSettings ? 'rotate-90 transition-transform' : 'transition-transform'} />
            </button>
            
            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Qualidade do Vídeo
                </div>
                <button 
                  onClick={() => changeQuality(-1)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-600 transition flex justify-between items-center ${currentQuality === -1 ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300'}`}
                >
                  Automático
                  {currentQuality === -1 && <div className="w-2 h-2 bg-primary-500 rounded-full"></div>}
                </button>
                {qualityLevels.map((level, index) => (
                  <button 
                    key={index}
                    onClick={() => changeQuality(index)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-600 transition flex justify-between items-center ${currentQuality === index ? 'text-primary-400 bg-primary-500/10' : 'text-slate-300'}`}
                  >
                    {level.height}p
                    {currentQuality === index && <div className="w-2 h-2 bg-primary-500 rounded-full"></div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">{video.title}</h1>
          {video.status === 'processing' && (
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full border border-amber-500/20 text-sm font-bold">
              <Loader2 className="animate-spin" size={16} />
              Processando qualidades extras...
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6 text-slate-400">
          <span className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
            <Eye size={16} />
            {video.views?.toLocaleString() || 0} visualizações
          </span>
          <span className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
            <Tag size={16} />
            {video.Category?.name}
          </span>
          <span className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
            <Calendar size={16} />
            {new Date(video.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {video.description || 'Nenhuma descrição disponível.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
