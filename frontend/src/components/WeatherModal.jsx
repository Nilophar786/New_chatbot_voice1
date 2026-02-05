import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernButton from './ModernButton';

const WeatherModal = ({ isOpen, onClose, weatherData, loading, error }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900/95 backdrop-blur-lg border border-purple-400/30 rounded-2xl p-6 max-w-md w-full"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">Weather Information</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300">Fetching weather data...</p>
            </div>
          ) : error || !weatherData ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">Unable to fetch weather data</p>
              <p className="text-gray-300 text-sm">Please check your internet connection and try again.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {weatherData.location}, {weatherData.country}
                </h3>
                <p className="text-gray-300 text-sm">
                  Last updated: {new Date(weatherData.lastUpdated).toLocaleTimeString()}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-white mb-1">
                    {weatherData.temperature}°C
                  </div>
                  <div className="text-gray-300">
                    Feels like {weatherData.feelsLike}°C
                  </div>
                  <div className="text-lg text-purple-300 mt-2">
                    {weatherData.weatherDesc}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-gray-400">Humidity</div>
                    <div className="text-white font-semibold">{weatherData.humidity}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Wind Speed</div>
                    <div className="text-white font-semibold">{weatherData.windSpeed} km/h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Visibility</div>
                    <div className="text-white font-semibold">{weatherData.visibility} km</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Pressure</div>
                    <div className="text-white font-semibold">{weatherData.pressure} mb</div>
                  </div>
                </div>

                <div className="text-center mt-4 pt-4 border-t border-gray-600">
                  <div className="text-gray-400 text-sm">UV Index</div>
                  <div className="text-white font-semibold">{weatherData.uvIndex}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <ModernButton
              onClick={onClose}
              variant="secondary"
              size="medium"
            >
              Close
            </ModernButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherModal;
