import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ModernButton = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  className = "",
  showRipple = true,
  glowIntensity = "medium",
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const baseClasses = "relative rounded-full font-semibold font-['Orbitron'] overflow-hidden transition-all duration-300";

  const variants = {
    primary: "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white",
    secondary: "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 text-white",
    danger: "bg-gradient-to-r from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 text-white",
    success: "bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-300 hover:to-purple-500 text-white",
    neon: "bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 text-black",
    glass: "bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white",
    cyber: "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black",
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const glowColors = {
    primary: "#0f0",
    secondary: "#00f",
    danger: "#f00",
    success: "#f0f",
    neon: "#0ff",
    glass: "#fff",
    cyber: "#ff0",
  };

  const glowIntensityValues = {
    low: "0 0 10px",
    medium: "0 0 20px",
    high: "0 0 30px",
    extreme: "0 0 40px",
  };

  const handleClick = (e) => {
    if (disabled) return;

    if (showRipple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple = {
        id: Date.now(),
        x,
        y,
        size,
      };

      setRipples(prev => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    onClick?.(e);
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? {
        scale: 1.05,
        boxShadow: `${glowIntensityValues[glowIntensity]} ${glowColors[variant]}`,
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        style={{
          background: `linear-gradient(45deg, transparent, ${glowColors[variant]}20, transparent)`,
        }}
        whileHover={!disabled ? {
          opacity: 1,
          background: `linear-gradient(45deg, transparent, ${glowColors[variant]}40, transparent)`,
        } : {}}
        transition={{ duration: 0.3 }}
      />

      {/* Pulsing background for neon variant */}
      {variant === 'neon' && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff)',
            filter: 'blur(10px)',
            opacity: 0.3,
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 opacity-0"
        style={{ borderColor: glowColors[variant] }}
        whileHover={!disabled ? {
          opacity: 1,
          boxShadow: `inset 0 0 20px ${glowColors[variant]}40, 0 0 20px ${glowColors[variant]}`,
        } : {}}
        transition={{ duration: 0.3 }}
      />

      {/* Cyber variant special effects */}
      {variant === 'cyber' && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-0"
            animate={{
              opacity: [0, 1, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </>
      )}

      {/* Glass variant special effects */}
      {variant === 'glass' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 via-cyan-400/10 to-white/5"
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
};

export default ModernButton;
