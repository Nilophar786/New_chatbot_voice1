import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingAnimation = ({
  type = 'spinner',
  message = 'Loading...',
  size = 'medium',
  color = '#00ffff',
  showProgress = false,
  progress = 0,
  className = ''
}) => {
  const [dots, setDots] = useState('');
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    if (type === 'dots') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }

    if (type === 'scan') {
      const interval = setInterval(() => {
        setScanPosition(prev => (prev + 2) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [type]);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const renderSpinner = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 border-4 border-transparent rounded-full"
        style={{
          borderTopColor: color,
          borderRightColor: `${color}40`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{ backgroundColor: `${color}20` }}
        animate={{
          boxShadow: [
            `inset 0 0 20px ${color}`,
            `inset 0 0 40px ${color}, 0 0 20px ${color}`,
            `inset 0 0 20px ${color}`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );

  const renderDots = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-cyan-400 font-mono">{message}</span>
      <motion.span
        className="text-cyan-400"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {dots}
      </motion.span>
    </div>
  );

  const renderPulse = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0.3, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const renderScan = () => (
    <div className={`relative w-64 h-32 bg-black/50 backdrop-blur-sm rounded-lg border border-cyan-400/30 ${className}`}>
      {/* Scan line */}
      <motion.div
        className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        style={{ top: `${scanPosition}%` }}
        animate={{
          boxShadow: [
            '0 0 10px #00ffff',
            '0 0 20px #00ffff, 0 0 30px #ff00ff',
            '0 0 10px #00ffff'
          ]
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
        }}
      />

      {/* Data blocks */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400/60 rounded-sm"
          style={{
            left: `${(i * 5) % 90}%`,
            top: `${Math.floor(i / 10) * 40 + 20}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}

      <div className="absolute bottom-2 left-2 text-cyan-400 text-sm font-mono">
        Scanning...
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className={`w-64 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-cyan-400 text-sm font-mono">{message}</span>
        <span className="text-cyan-400 text-sm font-mono">{progress}%</span>
      </div>

      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );

  const renderJarvisBoot = () => (
    <div className={`relative w-80 h-40 ${className}`}>
      {/* Jarvis logo/emblem */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="text-6xl font-bold text-cyan-400 font-mono">J</div>
      </motion.div>

      {/* Initializing text */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <span className="text-cyan-400 text-lg font-mono">Initializing Jarvis...</span>
      </motion.div>

      {/* Loading dots */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Circuit lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
        <motion.path
          d="M10,25 L90,25"
          stroke="#00ffff"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 1 }}
        />
        <motion.path
          d="M10,15 L40,15 L40,35 L90,35"
          stroke="#00ffff"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ delay: 1.2, duration: 1 }}
        />
      </svg>
    </div>
  );

  const renderers = {
    spinner: renderSpinner,
    dots: renderDots,
    pulse: renderPulse,
    scan: renderScan,
    progress: renderProgress,
    jarvis: renderJarvisBoot,
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {renderers[type]()}
        </motion.div>
      </AnimatePresence>

      {showProgress && type !== 'progress' && (
        <motion.div
          className="text-cyan-400 text-sm font-mono"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {progress}%
        </motion.div>
      )}
    </div>
  );
};

export default LoadingAnimation;
