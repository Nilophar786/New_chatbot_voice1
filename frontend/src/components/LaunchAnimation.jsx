import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingAnimation from './LoadingAnimation';

const LaunchAnimation = ({
  onComplete,
  duration = 3000,
  showProgress = true,
  assistantName = "Jarvis"
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const bootSteps = [
    { message: "Initializing neural networks...", duration: 800 },
    { message: "Loading AI modules...", duration: 600 },
    { message: "Calibrating voice systems...", duration: 500 },
    { message: "Connecting to knowledge base...", duration: 400 },
    { message: "Activating holographic interface...", duration: 300 },
    { message: `${assistantName} online and ready!`, duration: 400 }
  ];

  useEffect(() => {
    const totalDuration = bootSteps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += 50;
      const currentProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(currentProgress);

      const stepIndex = bootSteps.findIndex(step =>
        elapsed < bootSteps.slice(0, bootSteps.indexOf(step) + 1)
          .reduce((sum, s) => sum + s.duration, 0)
      );

      if (stepIndex !== -1 && stepIndex !== currentStep) {
        setCurrentStep(stepIndex);
      }

      if (elapsed >= totalDuration) {
        clearInterval(progressInterval);
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ffff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main content container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center p-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Jarvis logo/emblem */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              className="w-32 h-32 border-4 border-cyan-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner ring */}
            <motion.div
              className="absolute inset-4 border-2 border-purple-400 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />

            {/* Center emblem */}
            <motion.div
              className="absolute inset-8 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px #00ffff',
                  '0 0 40px #00ffff, 0 0 60px #ff00ff',
                  '0 0 20px #00ffff'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-4xl font-bold text-white font-mono">J</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Boot messages */}
        <div className="mb-8 min-h-[60px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-cyan-400 text-xl font-mono"
            >
              {bootSteps[currentStep]?.message}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <motion.div
            className="w-80 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
            <div className="text-cyan-400 text-sm font-mono text-center">
              {Math.round(progress)}% Complete
            </div>
          </motion.div>
        )}

        {/* Circuit lines animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <svg width="100%" height="100%" viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
            <motion.path
              d="M50,150 L350,150"
              stroke="#00ffff"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.5, duration: 1.5 }}
            />
            <motion.path
              d="M50,100 L150,100 L150,200 L350,200"
              stroke="#00ffff"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 2, duration: 1.5 }}
            />
            <motion.path
              d="M50,200 L100,200 L100,100 L350,100"
              stroke="#00ffff"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 2.5, duration: 1.5 }}
            />
          </svg>
        </motion.div>

        {/* Data stream effect */}
        <motion.div
          className="absolute right-8 top-1/2 transform -translate-y-1/2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="flex flex-col gap-1">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-4 bg-cyan-400"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scaleY: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Completion celebration */}
      {progress >= 100 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              initial={{
                x: 0,
                y: 0,
                scale: 0
              }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 300,
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Success message */}
          <motion.div
            className="text-center z-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          >
            <motion.h1
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4"
              animate={{
                textShadow: [
                  '0 0 20px #00ffff',
                  '0 0 40px #00ffff, 0 0 60px #ff00ff',
                  '0 0 20px #00ffff'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Welcome!
            </motion.h1>
            <p className="text-cyan-400 text-xl font-mono">
              {assistantName} is ready to assist you
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LaunchAnimation;
