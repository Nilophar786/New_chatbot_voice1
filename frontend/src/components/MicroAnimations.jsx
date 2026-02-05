import React from 'react';
import { motion } from 'framer-motion';

// Fade in animation variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Slide in from bottom
export const slideInBottomVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Slide in from top
export const slideInTopVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Slide in from left
export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Slide in from right
export const slideInRightVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Scale in animation
export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Bounce in animation
export const bounceInVariants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Staggered children animation
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Glow pulse animation
export const glowPulseVariants = {
  animate: {
    boxShadow: [
      '0 0 5px #00ffff',
      '0 0 10px #00ffff, 0 0 15px #ff00ff',
      '0 0 5px #00ffff'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Typing cursor animation
export const cursorVariants = {
  animate: {
    opacity: [1, 1, 0, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.5, 0.5, 1]
    }
  }
};

// Floating animation
export const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Rotation animation
export const rotationVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Pulse animation
export const pulseVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shake animation
export const shakeVariants = {
  animate: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

// Enhanced entrance animations
export const entranceVariants = {
  fadeIn: fadeInVariants,
  slideInBottom: slideInBottomVariants,
  slideInTop: slideInTopVariants,
  slideInLeft: slideInLeftVariants,
  slideInRight: slideInRightVariants,
  scaleIn: scaleInVariants,
  bounceIn: bounceInVariants,
};

// Wrapper components for easy use
export const FadeIn = ({ children, delay = 0, duration = 0.6, className = "" }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={fadeInVariants}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

export const SlideInBottom = ({ children, delay = 0, duration = 0.5, className = "" }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={slideInBottomVariants}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

export const SlideInTop = ({ children, delay = 0, duration = 0.5, className = "" }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={slideInTopVariants}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

export const SlideInLeft = ({ children, delay = 0, duration = 0.5, className = "" }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={slideInLeftVariants}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

export const SlideInRight = ({ children, delay = 0, duration = 0.5, className = "" }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={slideInRightVariants}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, duration = 0.4, className = "" }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={scaleInVariants}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

export const BounceIn = ({ children, delay = 0, duration = 0.6, className = "" }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={bounceInVariants}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

// Staggered container
export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
  delayChildren = 0.1
}) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      ...staggerContainerVariants,
      visible: {
        ...staggerContainerVariants.visible,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delayChildren
        }
      }
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }) => (
  <motion.div className={className} variants={staggerItemVariants}>
    {children}
  </motion.div>
);

// Floating element
export const FloatingElement = ({ children, className = "", intensity = 10 }) => (
  <motion.div
    className={className}
    variants={{
      animate: {
        y: [-intensity, intensity, -intensity],
        transition: {
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2
        }
      }
    }}
    animate="animate"
  >
    {children}
  </motion.div>
);

// Glow pulse element
export const GlowPulse = ({ children, className = "", color = "#00ffff" }) => (
  <motion.div
    className={className}
    animate={{
      boxShadow: [
        `0 0 5px ${color}`,
        `0 0 10px ${color}, 0 0 15px ${color}`,
        `0 0 5px ${color}`
      ]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

// Typing cursor
export const TypingCursor = ({ className = "", color = "#00ffff" }) => (
  <motion.span
    className={`inline-block ${className}`}
    style={{ color }}
    variants={cursorVariants}
    animate="animate"
  >
    |
  </motion.span>
);

// Rotation element
export const RotatingElement = ({ children, className = "", speed = 8 }) => (
  <motion.div
    className={className}
    animate={{
      rotate: 360,
      transition: {
        duration: speed,
        repeat: Infinity,
        ease: "linear"
      }
    }}
  >
    {children}
  </motion.div>
);

// Pulse element
export const PulsingElement = ({ children, className = "" }) => (
  <motion.div className={className} variants={pulseVariants} animate="animate">
    {children}
  </motion.div>
);

// Hover animations
export const hoverVariants = {
  scale: { scale: 1.05 },
  glow: {
    scale: 1.02,
    boxShadow: "0 0 20px #00ffff"
  },
  bounce: {
    scale: 1.1,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

export const HoverWrapper = ({
  children,
  variant = "scale",
  className = ""
}) => (
  <motion.div
    className={className}
    whileHover={hoverVariants[variant]}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {children}
  </motion.div>
);
