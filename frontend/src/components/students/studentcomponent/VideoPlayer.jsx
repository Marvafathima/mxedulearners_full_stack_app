import React, { useRef, useEffect, useState } from 'react';

const VideoPlayer = ({ lessonId, videoUrl, thumbnailUrl, onProgressUpdate, initialProgress }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current && !isNaN(initialProgress) && isFinite(initialProgress)) {
      videoRef.current.currentTime = initialProgress;
    }
  }, [initialProgress]);
//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.currentTime = initialProgress;
//     }
//   }, [initialProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onProgressUpdate(lessonId, video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [lessonId, onProgressUpdate]);

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="w-full"
        onClick={handlePlayPause}
      />
      <button
        className="absolute bottom-4 left-4 bg-white bg-opacity-50 p-2 rounded-full"
        onClick={handlePlayPause}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default VideoPlayer;