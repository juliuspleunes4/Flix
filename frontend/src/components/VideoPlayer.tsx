import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  onError?: () => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onLoadedData?: () => void;
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onProgress?: () => void;
  onWaiting?: () => void;
  onPlaying?: () => void;
  onPause?: () => void;
  onSuspend?: () => void;
  onStalled?: () => void;
  onEmptied?: () => void;
  onAbort?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  onError,
  onLoadStart,
  onCanPlay,
  onLoadedData,
  onLoadedMetadata,
  onProgress,
  onWaiting,
  onPlaying,
  onPause,
  onSuspend,
  onStalled,
  onEmptied,
  onAbort
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force remove any potential overlay styles
    video.style.setProperty('opacity', '1', 'important');
    video.style.setProperty('filter', 'none', 'important');
    video.style.setProperty('background-color', '#000', 'important');
    video.style.setProperty('mix-blend-mode', 'normal', 'important');
    video.style.setProperty('isolation', 'isolate', 'important');
    
    // Remove any potential pseudo-elements
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      video[data-video-id="${src}"]::before,
      video[data-video-id="${src}"]::after {
        display: none !important;
        content: none !important;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [src]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#000',
      isolation: 'isolate'
    }}>
      <video
        ref={videoRef}
        controls
        autoPlay
        preload="metadata"
        data-video-id={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          backgroundColor: '#000',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          filter: 'none',
          opacity: 1,
          mixBlendMode: 'normal',
          isolation: 'isolate',
          position: 'relative',
          zIndex: 1,
          display: 'block'
        }}
        src={src}
        onError={onError}
        onLoadStart={onLoadStart}
        onCanPlay={onCanPlay}
        onLoadedData={onLoadedData}
        onLoadedMetadata={onLoadedMetadata}
        onProgress={onProgress}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onPause={onPause}
        onSuspend={onSuspend}
        onStalled={onStalled}
        onEmptied={onEmptied}
        onAbort={onAbort}
      >
        <p style={{ color: 'white' }}>
          Your browser does not support the video element or there was an error loading the video.
        </p>
      </video>
    </div>
  );
};

export default VideoPlayer;
