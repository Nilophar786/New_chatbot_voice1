import React from 'react';
import { motion } from 'framer-motion';

const NeumorphismCard = ({
  children,
  className = "",
  intensity = "medium",
  color = "cyan",
  hoverEffect = true,
  ...props
}) => {
  const intensityClasses = {
    soft: "shadow-soft-inset",
    medium: "shadow-medium-inset",
    strong: "shadow-strong-inset"
  };

  const colorClasses = {
    cyan: "neumorphism-cyan",
    purple: "neumorphism-purple",
    pink: "neumorphism-pink",
    green: "neumorphism-green",
    orange: "neumorphism-orange",
    blue: "neumorphism-blue"
  };

  const baseClasses = `
    relative rounded-3xl border transition-all duration-300
    bg-gradient-to-br from-gray-100 to-gray-200
    dark:from-gray-800 dark:to-gray-900
    ${intensityClasses[intensity]}
    ${colorClasses[color]}
    ${className}
  `;

  return (
    <motion.div
      className={baseClasses}
      whileHover={hoverEffect ? {
        scale: 1.02,
        boxShadow: "inset 8px 8px 16px #1a1a1a, inset -8px -8px 16px #2a2a2a",
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}

      {/* Subtle inner glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-20 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      {/* Hover enhancement overlay */}
      {hoverEffect && (
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 bg-gradient-to-br from-cyan-400/5 to-purple-400/5 pointer-events-none"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

// Neumorphism button component
export const NeumorphismButton = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary: "neumorphism-button-primary",
    secondary: "neumorphism-button-secondary",
    success: "neumorphism-button-success",
    danger: "neumorphism-button-danger"
  };

  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      className={`
        relative rounded-full font-semibold font-['Orbitron']
        transition-all duration-300 cursor-pointer
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={!disabled ? {
        scale: 1.05,
        boxShadow: "inset 4px 4px 8px #1a1a1a, inset -4px -4px 8px #2a2a2a",
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

// Neumorphism toggle switch
export const NeumorphismToggle = ({
  isOn,
  onToggle,
  disabled = false,
  className = ""
}) => {
  return (
    <motion.button
      className={`
        relative w-16 h-8 rounded-full transition-all duration-300 cursor-pointer
        ${isOn
          ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-inset-green'
          : 'bg-gradient-to-r from-gray-300 to-gray-400 shadow-inset-gray'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <motion.div
        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
        animate={{
          x: isOn ? 32 : 4,
          backgroundColor: isOn ? '#10b981' : '#ffffff'
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      {/* Inner glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-30"
        animate={{
          background: isOn
            ? 'radial-gradient(circle at 70% 50%, rgba(16, 185, 129, 0.3), transparent 70%)'
            : 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.3), transparent 70%)'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

// Neumorphism input field
export const NeumorphismInput = ({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <motion.input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full px-4 py-3 rounded-xl font-medium font-['Orbitron']
        bg-gradient-to-br from-gray-100 to-gray-200
        dark:from-gray-800 dark:to-gray-900
        shadow-medium-inset border-0 outline-none
        text-gray-800 dark:text-gray-200
        placeholder-gray-500 dark:placeholder-gray-400
        transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:shadow-strong-inset'}
        ${className}
      `}
      whileFocus={{
        scale: 1.02,
        boxShadow: "inset 6px 6px 12px #1a1a1a, inset -6px -6px 12px #2a2a2a",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    />
  );
};

// Neumorphism progress bar
export const NeumorphismProgress = ({
  progress = 0,
  className = "",
  color = "cyan",
  showPercentage = false
}) => {
  return (
    <div className={`relative w-full h-4 rounded-full shadow-medium-inset ${className}`}>
      <motion.div
        className={`h-full rounded-full transition-all duration-500 ${
          color === 'cyan' ? 'bg-gradient-to-r from-cyan-400 to-cyan-500' :
          color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
          color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-500' :
          'bg-gradient-to-r from-blue-400 to-blue-500'
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default NeumorphismCard;
