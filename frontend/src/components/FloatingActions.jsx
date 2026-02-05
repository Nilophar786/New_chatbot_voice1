import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalculator,
  FaCloudSun,
  FaWikipediaW,
  FaLaugh,
  FaStickyNote,
  FaEllipsisH,
  FaTimes
} from 'react-icons/fa';

const FloatingActions = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: FaCalculator, label: 'Calculator', color: '#ff6b6b', action: 'calculator' },
    { icon: FaCloudSun, label: 'Weather', color: '#4ecdc4', action: 'weather' },
    { icon: FaWikipediaW, label: 'Wikipedia', color: '#45b7d1', action: 'wikipedia' },
    { icon: FaLaugh, label: 'Jokes', color: '#f9ca24', action: 'jokes' },
    { icon: FaStickyNote, label: 'Notes', color: '#6c5ce7', action: 'notes' },
  ];

  const handleAction = (actionType) => {
    onAction(actionType);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 shadow-[0_0_40px_#00f]">
              <div className="grid grid-cols-2 gap-2">
                {actions.map((action, index) => (
                  <motion.button
                    key={action.action}
                    className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                    onClick={() => handleAction(action.action)}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: `0 0 20px ${action.color}`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <action.icon className="text-lg mb-1" />
                    <span className="text-xs font-['Orbitron']">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_30px_#f0f] flex items-center justify-center text-white"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{
          scale: 1.1,
          boxShadow: '0 0 40px #f0f',
        }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isOpen ? 180 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaEllipsisH className="text-xl" />}
      </motion.button>
    </div>
  );
};

export default FloatingActions;
