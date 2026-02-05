import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageWithLoading = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  loadingClassName = '',
  errorClassName = '',
  showLoadingSpinner = true,
  loadingSize = 'medium',
  onLoad,
  onError,
  ...props
}) => {
  const [imageStatus, setImageStatus] = useState('loading'); // 'loading', 'loaded', 'error'
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleImageLoad = () => {
    setImageStatus('loaded');
    onLoad?.();
  };

  const handleImageError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      // Try fallback image first
      setCurrentSrc(fallbackSrc);
      setImageStatus('loading');
    } else {
      // If fallback also fails, show error state
      setImageStatus('error');
      onError?.();
    }
  };

  const handleRetry = () => {
    setImageStatus('loading');
    setCurrentSrc(src);
  };

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const LoadingSpinner = () => (
    showLoadingSpinner && (
      <div className={`absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm ${loadingClassName}`}>
        <motion.div
          className={`border-4 border-cyan-400/30 border-t-cyan-400 rounded-full ${sizeClasses[loadingSize]}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  );

  const ErrorPlaceholder = () => (
    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm ${errorClassName}`}>
      <div className="text-red-400 text-2xl mb-2">⚠️</div>
      <div className="text-gray-400 text-sm text-center px-2">Failed to load</div>
      <button
        onClick={handleRetry}
        className="mt-2 px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded text-xs hover:bg-cyan-400/30 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {imageStatus === 'loading' && <LoadingSpinner />}
        {imageStatus === 'error' && <ErrorPlaceholder />}
      </AnimatePresence>

      {imageStatus !== 'error' && (
        <motion.img
          src={currentSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      )}
    </div>
  );
};

export default ImageWithLoading;
