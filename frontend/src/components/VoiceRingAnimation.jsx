import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceRingAnimation = ({
  isListening = false,
  isSpeaking = false,
  audioStream = null,
  className = "",
  intensity = 1,
  showWaveform = true,
  showRings = true,
  showCenterPulse = true
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (audioStream && !audioContextRef.current) {
      // Set up Web Audio API
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(audioStream);
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      setAudioData(new Uint8Array(bufferLength));
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [audioStream]);

  // Update active state based on listening/speaking
  useEffect(() => {
    setIsActive(isListening || isSpeaking);
  }, [isListening, isSpeaking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = () => {
      if (!analyserRef.current || !audioData.length) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      analyserRef.current.getByteFrequencyData(audioData);

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create enhanced gradient for rings
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0.9)');
      gradient.addColorStop(0.3, 'rgba(255, 0, 255, 0.6)');
      gradient.addColorStop(0.7, 'rgba(0, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0.05)');

      // Draw multiple rings based on audio data with enhanced effects
      const numRings = 6;
      for (let i = 0; i < numRings; i++) {
        const average = audioData.slice(i * 40, (i + 1) * 40).reduce((a, b) => a + b, 0) / 40;
        const baseRadius = 40 + (i * 30);
        const dynamicRadius = baseRadius + (average * intensity / 8);
        const opacity = Math.max(0.1, (average / 255) * 0.8 * intensity);

        // Draw main ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
        ctx.lineWidth = 2 + (i * 0.5);
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = isListening ? '#00ffff' : '#ff00ff';
        ctx.shadowBlur = 15 + (average / 20);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Add inner glow for more depth
        ctx.beginPath();
        ctx.arc(centerX, centerY, dynamicRadius - 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Enhanced center pulse with multiple layers
      const centerRadius = 25 + (audioData[0] * intensity / 15);
      const centerOpacity = Math.max(0.2, (audioData[0] / 255) * 0.6);

      // Outer center ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius + 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 255, ${centerOpacity * 0.3})`;
      ctx.fill();

      // Middle center ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius + 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 0, 255, ${centerOpacity * 0.4})`;
      ctx.fill();

      // Inner center pulse
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 255, ${centerOpacity})`;
      ctx.fill();

      // Add sparkle effects for high intensity
      if (audioData[0] > 200) {
        for (let i = 0; i < 3; i++) {
          const angle = (Date.now() * 0.01) + (i * Math.PI * 2 / 3);
          const sparkleX = centerX + Math.cos(angle) * (centerRadius + 15);
          const sparkleY = centerY + Math.sin(angle) * (centerRadius + 15);

          ctx.beginPath();
          ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData, isListening, isSpeaking, intensity]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Canvas for waveform visualization */}
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="absolute inset-0"
        style={{ filter: 'blur(0.5px)' }}
      />

      {/* Animated rings for listening state */}
      {isListening && (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${100 + i * 40}px`,
                height: `${100 + i * 40}px`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 0.3, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      {/* Pulsing center for speaking state */}
      {isSpeaking && (
        <motion.div
          className="absolute w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
            boxShadow: [
              '0 0 20px #00ffff',
              '0 0 40px #00ffff, 0 0 60px #ff00ff',
              '0 0 20px #00ffff'
            ]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Ripple effect for active states */}
      {(isListening || isSpeaking) && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}

      {/* Status indicator */}
      <div className="relative z-10 flex items-center justify-center">
        <motion.div
          className={`w-4 h-4 rounded-full ${
            isListening ? 'bg-green-400' : isSpeaking ? 'bg-blue-400' : 'bg-gray-400'
          }`}
          animate={{
            scale: isListening || isSpeaking ? [1, 1.3, 1] : [1],
            boxShadow: isListening || isSpeaking
              ? [
                  '0 0 10px #00ff00',
                  '0 0 20px #00ff00, 0 0 30px #00ffff',
                  '0 0 10px #00ff00'
                ]
              : '0 0 5px #00ff00',
          }}
          transition={{
            duration: isListening || isSpeaking ? 1 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default VoiceRingAnimation;
