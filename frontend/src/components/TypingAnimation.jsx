import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypingAnimation = ({
  text,
  speed = 50,
  showCursor = true,
  cursorChar = '|',
  className = '',
  onComplete,
  startDelay = 0
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);

    const startTyping = () => {
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      };

      const timer = setInterval(typeNextChar, speed);
      return () => clearInterval(timer);
    };

    const delayTimer = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(delayTimer);
    };
  }, [text, speed, startDelay, onComplete]);

  if (!text) return null;

  return (
    <span className={`inline-block ${className}`}>
      <motion.span
        key={text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {displayText}
        {!isComplete && showCursor && (
          <motion.span
            className="inline-block ml-1 text-cyan-400"
            animate={{
              opacity: [1, 1, 0, 0],
              scale: [1, 1, 1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 0.5, 1],
            }}
            style={{
              textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
            }}
          >
            {cursorChar}
          </motion.span>
        )}
      </motion.span>

      {/* Glow effect for typing text */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent rounded"
        animate={{
          opacity: isComplete ? 0 : [0, 0.3, 0],
          scale: isComplete ? 1 : [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: isComplete ? 0 : Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: 'blur(4px)',
        }}
      />
    </span>
  );
};

// Enhanced typing animation with sound effects
export const TypingAnimationWithSound = ({
  text,
  speed = 50,
  showCursor = true,
  cursorChar = '|',
  className = '',
  onComplete,
  startDelay = 0,
  playSound = false
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);

    const startTyping = () => {
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);

          // Play typing sound effect
          if (playSound) {
            playTypingSound();
          }
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      };

      const timer = setInterval(typeNextChar, speed);
      return () => clearInterval(timer);
    };

    const delayTimer = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(delayTimer);
    };
  }, [text, speed, startDelay, onComplete, playSound]);

  const playTypingSound = () => {
    try {
      // Create a subtle typing sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800 + Math.random() * 200, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if audio context is not available
      console.debug('Audio context not available for typing sound');
    }
  };

  if (!text) return null;

  return (
    <span className={`inline-block ${className}`}>
      <motion.span
        key={text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {displayText}
        {!isComplete && showCursor && (
          <motion.span
            className="inline-block ml-1 text-cyan-400"
            animate={{
              opacity: [1, 1, 0, 0],
              scale: [1, 1, 1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 0.5, 1],
            }}
            style={{
              textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
            }}
          >
            {cursorChar}
          </motion.span>
        )}
      </motion.span>

      {/* Enhanced glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent rounded"
        animate={{
          opacity: isComplete ? 0 : [0, 0.5, 0],
          scale: isComplete ? 1 : [1, 1.05, 1],
          boxShadow: isComplete
            ? 'none'
            : [
                '0 0 10px #00ffff',
                '0 0 20px #00ffff, 0 0 30px #ff00ff',
                '0 0 10px #00ffff'
              ],
        }}
        transition={{
          duration: 2,
          repeat: isComplete ? 0 : Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: 'blur(4px)',
        }}
      />
    </span>
  );
};

export default TypingAnimation;
