import axios from 'axios';

const getWeather = async (req, res) => {
  try {
    const { city = 'London' } = req.params;

    // Use wttr.in API - free weather API, no key required
    const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
      timeout: 10000 // 10 second timeout
    });

    if (response.data) {
      // Parse the weather data
      const weatherData = response.data;
      const current = weatherData.current_condition[0];
      const location = weatherData.nearest_area[0];

      const weatherInfo = {
        location: location.areaName[0].value,
        country: location.country[0].value,
        temperature: current.temp_C,
        feelsLike: current.FeelsLikeC,
        humidity: current.humidity,
        weatherDesc: current.weatherDesc[0].value,
        windSpeed: current.windspeedKmph,
        visibility: current.visibility,
        pressure: current.pressure,
        uvIndex: current.uvIndex,
        lastUpdated: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        data: weatherInfo
      });
    } else {
      throw new Error('No weather data received');
    }
  } catch (error) {
    console.error('Weather API error:', error.message);

    // Return fallback data if API fails
    res.status(200).json({
      success: true,
      data: {
        location: req.params.city || 'Unknown',
        country: 'N/A',
        temperature: 'N/A',
        feelsLike: 'N/A',
        humidity: 'N/A',
        weatherDesc: 'Weather data unavailable',
        windSpeed: 'N/A',
        visibility: 'N/A',
        pressure: 'N/A',
        uvIndex: 'N/A',
        lastUpdated: new Date().toISOString(),
        error: 'Unable to fetch weather data'
      }
    });
  }
};

export { getWeather };
