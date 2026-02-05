import axios from 'axios';

export const searchWeb = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // For now, return mock search results
    // In production, integrate with Google Custom Search API
    const mockResults = [
      {
        title: `Search result for: ${query}`,
        link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        snippet: `This is a mock search result for ${query}. In production, this will show real Google search results.`
      }
    ];

    return res.status(200).json({
      query,
      results: mockResults,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Search failed",
      details: error.message 
    });
  }
};

export const getWikipediaSummary = async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    // Wikipedia API endpoint
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
    
    return res.status(200).json({
      topic,
      summary: response.data.extract,
      url: response.data.content_urls.desktop.page,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Wikipedia lookup failed",
      details: error.message 
    });
  }
};

export const getWeather = async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    // Mock weather data
    // In production, integrate with OpenWeatherMap API
    const mockWeather = {
      temperature: "25°C",
      description: "Sunny",
      humidity: "60%",
      windSpeed: "10 km/h"
    };

    return res.status(200).json({
      city,
      weather: mockWeather,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Weather lookup failed",
      details: error.message 
    });
  }
};
