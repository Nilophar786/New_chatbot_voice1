import React from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaComments, FaThLarge } from 'react-icons/fa';

const ModernToggle = ({ mode, setMode, disabled = false }) => {
  return (
    <div className="flex items-center gap-4 p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
      {/* Chatbot Mode */}
      <motion.button
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
          mode === "chatbot"
            ? "text-blue-600"
            : "text-gray-400 hover:text-white"
        }`}
        onClick={() => !disabled && setMode("chatbot")}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <FaComments className="text-lg" />
        <span className="font-['Orbitron']">Chatbot</span>

        {mode === "chatbot" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full"
            layoutId="activeMode"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </motion.button>

      {/* Voice Mode */}
      <motion.button
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
          mode === "voice"
            ? "text-green-600"
            : "text-gray-400 hover:text-white"
        }`}
        onClick={() => !disabled && setMode("voice")}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <FaMicrophone className="text-lg" />
        <span className="font-['Orbitron']">Voice</span>

        {mode === "voice" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full"
            layoutId="activeMode"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </motion.button>

      {/* Dashboard Mode */}
      <motion.button
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
          mode === "dashboard"
            ? "text-purple-600"
            : "text-gray-400 hover:text-white"
        }`}
        onClick={() => !disabled && setMode("dashboard")}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <FaThLarge className="text-lg" />
        <span className="font-['Orbitron']">Dashboard</span>

        {mode === "dashboard" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full"
            layoutId="activeMode"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </motion.button>

      {/* Animated indicator */}
      <motion.div
        className="absolute top-1 bottom-1 w-1 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full"
        animate={{
          x: mode === "chatbot" ? 4 : mode === "voice" ? 60 : 116,
          boxShadow: mode === "chatbot"
            ? '0 0 10px #00f'
            : mode === "voice"
            ? '0 0 10px #0f0'
            : '0 0 10px #f0f',
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </div>
  );
};

export default ModernToggle;
