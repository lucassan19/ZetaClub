const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Configurar caminhos explícitos para FFmpeg e FFprobe (especialmente para VPS)
if (process.env.NODE_ENV === 'production') {
  ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
  ffmpeg.setFfprobePath('/usr/bin/ffprobe');
}


const getVideoResolution = (videoPath) => {
  return new Promise((resolve, reject) => {
    console.log("[FFPROBE] Analisando resolução do vídeo:", videoPath);
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error("[FFPROBE_ERROR] Erro ao analisar vídeo:", err);
        reject(err);
        return;
      }
      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      if (!videoStream) {
        reject(new Error('No video stream found'));
        return;
      }
      console.log("[FFPROBE] Resolução detectada:", videoStream.width, "x", videoStream.height);
      resolve({
        width: videoStream.width,
        height: videoStream.height
      });
    });
  });
};

const processVideo = async (videoPath, outputDir) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Process all resolutions sequentially
    (async () => {
      try {
        // Check if ffmpeg is available - removido para não mascarar erros reais
        // Vamos deixar o processamento iniciar e logar o erro real se acontecer

        // Obter resolução original
        const { height: originalHeight, width: originalWidth } = await getVideoResolution(videoPath);
        
        // Definir resoluções disponíveis
        const allResolutions = [
          { name: '480p', width: 854, height: 480, bitrate: '800k' },
          { name: '720p', width: 1280, height: 720, bitrate: '2500k' },
          { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' }
        ];
        
        // Filtrar apenas resoluções menores ou iguais à original (máximo até 1080p)
        const resolutions = allResolutions.filter(res => res.height <= originalHeight);
        
        let masterPlaylist = '#EXTM3U\n#EXT-X-VERSION:3\n';
        const generatedQualities = [];
        
        const processResolution = (res) => {
          return new Promise((resResolve, resReject) => {
            const resDir = path.join(outputDir, res.name);
            if (!fs.existsSync(resDir)) fs.mkdirSync(resDir);

            ffmpeg(videoPath)
              .size(`${res.width}x${res.height}`)
              .videoBitrate(res.bitrate)
              .addOption('-hls_time', 10)
              .addOption('-hls_list_size', 0)
              .addOption('-threads', 1) // Limit to 1 thread to avoid crashing 1GB RAM server
              .addOption('-hls_segment_filename', path.join(resDir, 'segment%d.ts').replace(/\\/g, '/'))
              .on("start", command => {
                console.log("[FFMPEG] Command:", command);
              })
              .on("stderr", line => {
                console.log("[FFMPEG]", line);
              })
              .on('error', (err, stdout, stderr) => {
                console.error("[FFMPEG_ERROR] Complete error object:", err);
                console.error("[FFMPEG_ERROR] stdout:", stdout);
                console.error("[FFMPEG_ERROR] stderr:", stderr);
                resReject(err);
              })
              .on('end', () => {
                const playlistPath = `${res.name}/playlist.m3u8`;
                masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(res.bitrate) * 1000},RESOLUTION=${res.width}x${res.height}\n${playlistPath}\n`;
                generatedQualities.push({
                  name: res.name,
                  playlist: playlistPath,
                  width: res.width,
                  height: res.height,
                  bandwidth: parseInt(res.bitrate) * 1000
                });
                resResolve();
              })
              .save(path.join(resDir, 'playlist.m3u8').replace(/\\/g, '/'));
          });
        };

        for (const res of resolutions) {
          console.log(`Processing ${res.name}...`);
          await processResolution(res);
        }
        
        const masterHlsPath = path.join(outputDir, 'master.m3u8').replace(/\\/g, '/');
        fs.writeFileSync(masterHlsPath, masterPlaylist);
        console.log('Video processing completed successfully');
        resolve({
          hlsPath: masterHlsPath,
          qualities: generatedQualities
        });
      } catch (err) {
        console.error('Error during video processing:', err);
        reject(err);
      }
    })();
  });
};

const generateThumbnail = (videoPath, outputDir, videoId) => {
  return new Promise((resolve, reject) => {
    const thumbName = `thumb.jpg`;
    const thumbPath = path.join(outputDir, thumbName);

    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['10%'],
        filename: thumbName,
        folder: outputDir,
        size: '640x360'
      })
      .on('end', () => {
        resolve(`/uploads/videos/${videoId}/${thumbName}`.replace(/\\/g, '/'));
      })
      .on('error', (err) => {
        console.error('Error generating thumbnail:', err);
        reject(err);
      });
  });
};

module.exports = { processVideo, generateThumbnail };
