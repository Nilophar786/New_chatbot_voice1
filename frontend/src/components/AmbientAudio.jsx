import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVolumeUp, FaVolumeMute, FaPlay, FaPause } from 'react-icons/fa';

const AmbientAudio = ({
  backgroundMusic = null,
  soundEffects = {},
  volume = 0.3,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [showControls, setShowControls] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const audioRef = useRef(null);
  const effectsRef = useRef({});
  const hoverTimeoutRef = useRef(null);

  // Available ambient tracks (you can add your own audio files)
  const ambientTracks = [
    '/ambient/cyber-ambient.mp3',
    '/ambient/futuristic-atmosphere.mp3',
    '/ambient/digital-rain.mp3',
    '/ambient/neural-network.mp3'
  ];

  useEffect(() => {
    // Initialize audio context
    const initAudio = async () => {
      try {
        if (backgroundMusic && audioRef.current) {
          audioRef.current.volume = isMuted ? 0 : currentVolume;
          audioRef.current.loop = true;

          if (isPlaying) {
            await audioRef.current.play();
          }
        }
      } catch (error) {
        console.debug('Audio initialization failed:', error);
      }
    };

    initAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [backgroundMusic, isPlaying, isMuted, currentVolume]);

  const playSoundEffect = (effectName) => {
    if (isMuted || !soundEffects[effectName]) return;

    try {
      const audio = new Audio(soundEffects[effectName]);
      audio.volume = currentVolume * 0.7; // Slightly quieter than background music
      audio.play().catch(e => console.debug('Sound effect failed:', e));
    } catch (error) {
      console.debug('Sound effect playback failed:', error);
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.debug('Play/pause failed:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : currentVolume;
    }
  };

  const handleVolumeChange = (newVolume) => {
    setCurrentVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % ambientTracks.length);
  };

  const previousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + ambientTracks.length) % ambientTracks.length);
  };

  // Mouse hover effects for controls
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={backgroundMusic || ambientTracks[currentTrack]}
        preload="metadata"
        onEnded={nextTrack}
      />

      {/* Ambient audio controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 p-3 bg-black/80 backdrop-blur-xl rounded-lg border border-cyan-400/30 shadow-lg"
          >
            <div className="flex items-center gap-3">
              {/* Play/Pause button */}
              <motion.button
                onClick={togglePlayPause}
                className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
              </motion.button>

              {/* Mute button */}
              <motion.button
                onClick={toggleMute}
                className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
              </motion.button>

              {/* Volume slider */}
              <div className="flex items-center gap-2 min-w-[80px]">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={currentVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #00ffff 0%, #00ffff ${currentVolume * 100}%, #374151 ${currentVolume * 100}%, #374151 100%)`
                  }}
                />
              </div>

              {/* Track navigation */}
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={previousTrack}
                  className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ⏮
                </motion.button>
                <motion.button
                  onClick={nextTrack}
                  className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ⏭
                </motion.button>
              </div>
            </div>

            {/* Track info */}
            <div className="mt-2 text-xs text-cyan-400 text-center">
              Track {currentTrack + 1} / {ambientTracks.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient indicator */}
      <motion.div
        className="flex items-center gap-2 px-3 py-1 bg-cyan-400/10 backdrop-blur-sm rounded-full border border-cyan-400/20 cursor-pointer"
        onClick={() => setShowControls(!showControls)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing indicator */}
        <motion.div
          className="w-2 h-2 bg-cyan-400 rounded-full"
          animate={{
            scale: isPlaying ? [1, 1.3, 1] : [1],
            opacity: isPlaying ? [1, 0.7, 1] : [0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Status text */}
        <span className="text-cyan-400 text-sm font-mono">
          {isMuted ? 'MUTED' : isPlaying ? 'AMBIENT' : 'PAUSED'}
        </span>

        {/* Volume indicator bars */}
        {[1, 2, 3, 4, 5].map((bar) => (
          <motion.div
            key={bar}
            className="w-0.5 bg-cyan-400"
            style={{ height: `${4 + bar * 2}px` }}
            animate={{
              scaleY: isPlaying && !isMuted && currentVolume > (bar - 1) * 0.2 ? [1, 1.5, 1] : [0.5],
              opacity: isPlaying && !isMuted && currentVolume > (bar - 1) * 0.2 ? [1, 0.7, 1] : [0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: bar * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

// Hook for playing sound effects throughout the app
export const useSoundEffects = () => {
  const playClick = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQF0AAESsAQAEaAEAAGFtb2cAAAB//8AAAB//8AAAFMB');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const playHover = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQF0AAESsAQAEaAEAAGFtb2cAAAB//8AAAB//8AAAFMB');
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  const playSuccess = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQF0AAESsAQAEaAEAAGFtb2cAAAB//8AAAB//8AAAFMB');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const playError = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQF0AAESsAQAEaAEAAGFtb2cAAAB//8AAAB//8AAAFMB');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  return {
    playClick,
    playHover,
    playSuccess,
    playError,
  };
};

export default AmbientAudio;
