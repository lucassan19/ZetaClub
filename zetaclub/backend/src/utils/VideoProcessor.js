const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const processVideo = async (videoPath, outputDir) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const resolutions = [
      { name: '480p', width: 854, height: 480, bitrate: '800k' },
      { name: '720p', width: 1280, height: 720, bitrate: '2500k' },
      { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' }
    ];

    let masterPlaylist = '#EXTM3U\n#EXT-X-VERSION:3\n';
    
    const processResolution = (res) => {
      return new Promise((resResolve, resReject) => {
        const resDir = path.join(outputDir, res.name);
        if (!fs.existsSync(resDir)) fs.mkdirSync(resDir);

        ffmpeg(videoPath)
          .size(`${res.width}x${res.height}`)
          .videoBitrate(res.bitrate)
          .addOption('-hls_time', 10)
          .addOption('-hls_list_size', 0)
          .addOption('-hls_segment_filename', path.join(resDir, 'segment%d.ts'))
          .on('error', (err) => resReject(err))
          .on('end', () => {
            masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(res.bitrate) * 1000},RESOLUTION=${res.width}x${res.height}\n${res.name}/playlist.m3u8\n`;
            resResolve();
          })
          .save(path.join(resDir, 'playlist.m3u8'));
      });
    };

    // Process all resolutions sequentially
    (async () => {
      try {
        // Check if ffmpeg is available
        await new Promise((resolve, reject) => {
          ffmpeg.getAvailableFormats((err) => {
            if (err) reject(new Error('FFmpeg not found or not working'));
            else resolve();
          });
        });

        for (const res of resolutions) {
          console.log(`Processing ${res.name}...`);
          await processResolution(res);
        }
        
        fs.writeFileSync(path.join(outputDir, 'master.m3u8'), masterPlaylist);
        console.log('Video processing completed successfully');
        resolve();
      } catch (err) {
        console.error('Error during video processing:', err);
        reject(err);
      }
    })();
  });
};

module.exports = { processVideo };
