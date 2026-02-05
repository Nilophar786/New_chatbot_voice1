import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DynamicGreeting = ({ userName, assistantName }) => {
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();

      let timeGreeting = '';
      let emoji = '';

      if (hour < 12) {
        timeGreeting = 'Good Morning';
        emoji = '🌅';
      } else if (hour < 17) {
        timeGreeting = 'Good Afternoon';
        emoji = '☀️';
      } else if (hour < 21) {
        timeGreeting = 'Good Evening';
        emoji = '🌆';
      } else {
        timeGreeting = 'Good Night';
        emoji = '🌙';
      }

      setTimeOfDay(timeGreeting);

      const motivationalMessages = [
        'Your Virtual AI is Ready',
        'Ready to Assist You',
        'AI Power Activated',
        'Your Digital Companion Awaits',
        'Intelligence at Your Service',
      ];

      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setGreeting(`${emoji} ${timeGreeting}, ${userName} ⚡ ${randomMessage}`);
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [userName]);

  return (
    <motion.div
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        className="text-4xl md:text-5xl font-bold font-['Orbitron'] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        style={{
          textShadow: '0 0 30px #00f, 0 0 60px #f0f',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {greeting}
      </motion.h1>

      <motion.div
        className="mt-4 flex justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"
             style={{ boxShadow: '0 0 20px #00f' }} />
      </motion.div>
    </motion.div>
  );
};

export default DynamicGreeting;
