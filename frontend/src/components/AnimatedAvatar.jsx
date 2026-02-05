import React from 'react';
import { motion } from 'framer-motion';

const AnimatedAvatar = ({ imageSrc, assistantName, isListening, isSpeaking }) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Outer glowing ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #00f, #0f0, #f0f, #ff0, #f00, #00f)',
          padding: '4px',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-full h-full rounded-full bg-black"></div>
      </motion.div>

      {/* Middle pulsing ring */}
      <motion.div
        className="absolute inset-2 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner glow ring */}
      <motion.div
        className="absolute inset-4 rounded-full"
        animate={{
          boxShadow: [
            '0 0 20px #00f',
            '0 0 40px #00f, 0 0 60px #f0f',
            '0 0 20px #00f',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Avatar container with glassmorphism */}
      <motion.div
        className="relative w-[280px] h-[380px] bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_#00f] overflow-hidden"
        whileHover={{
          scale: 1.05,
          boxShadow: '0 0 60px #00f, 0 0 80px #f0f',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Avatar image */}
        <div className="w-full h-full flex justify-center items-center p-4">
          <motion.img
            src={imageSrc}
            alt={assistantName}
            className="w-full h-full object-cover rounded-full"
            animate={{
              filter: isListening
                ? 'brightness(1.2) saturate(1.5)'
                : isSpeaking
                ? 'brightness(1.1) saturate(1.2)'
                : 'brightness(1)',
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Overlay effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-cyan-400/20 rounded-3xl"
          animate={{
            opacity: isListening ? 0.6 : 0.3,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Status indicator */}
        <motion.div
          className="absolute top-4 right-4 w-4 h-4 rounded-full bg-green-400"
          animate={{
            scale: isListening ? [1, 1.2, 1] : [1, 0.8, 1],
            boxShadow: isListening
              ? ['0 0 10px #0f0', '0 0 20px #0f0', '0 0 10px #0f0']
              : '0 0 5px #0f0',
          }}
          transition={{
            duration: isListening ? 1 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Assistant name with glow */}
      <motion.h1
        className="text-white text-2xl font-bold mt-6 font-['Orbitron']"
        style={{
          textShadow: '0 0 20px #00f, 0 0 40px #00f, 0 0 60px #00f',
        }}
        animate={{
          textShadow: isSpeaking
            ? '0 0 20px #ff0, 0 0 40px #ff0, 0 0 60px #ff0'
            : '0 0 20px #00f, 0 0 40px #00f, 0 0 60px #00f',
        }}
        transition={{ duration: 0.5 }}
      >
        {assistantName}
      </motion.h1>
    </div>
  );
};

export default AnimatedAvatar;
