import React from 'react';
import { motion } from 'framer-motion';

const GlassmorphismCard = ({
  children,
  className = "",
  glowColor = "#00f",
  hoverGlow = true,
  ...props
}) => {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_0_40px_${glowColor}] ${className}`}
      whileHover={hoverGlow ? {
        scale: 1.02,
        boxShadow: `0 0 60px ${glowColor}, 0 0 80px ${glowColor}`,
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassmorphismCard;
