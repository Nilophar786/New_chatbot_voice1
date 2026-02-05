import puppeteer from 'puppeteer';
import axios from 'axios';
import moment from 'moment';
import User from '../models/user.model.js';

// Function to get next weekend dates
const getNextWeekendDates = () => {
  const today = moment();
  const dayOfWeek = today.day();
  let daysToFriday = (5 - dayOfWeek) % 7;
  if (daysToFriday === 0 && today.hour() >= 18) { // If it's Friday after 6 PM, next weekend
    daysToFriday = 7;
  }
  const friday = today.clone().add(daysToFriday, 'days');
  const sunday = friday.clone().add(2, 'days');
  return {
    start: friday.format('YYYY-MM-DD'),
    end: sunday.format('YYYY-MM-DD')
  };
};

// Function to scrape flight prices from Google Flights
const getFlightPrices = async (from, to, dates) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const url = `https://www.google.com/flights?hl=en#flt=${from}.${to}.${dates.start}*${to}.${from}.${dates.end};c:INR;e:1;sd:1;t:f;tt:o`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for results to load
    await page.waitForSelector('.gws-flights-results__result-item', { timeout: 10000 });

    // Scrape flight data
    const flights = await page.evaluate(() => {
      const results = [];
      const items = document.querySelectorAll('.gws-flights-results__result-item');
      items.forEach((item, index) => {
        if (index >= 3) return; // Get top 3 results
        const airline = item.querySelector('.gws-flights-results__airline-name')?.textContent?.trim() || 'Unknown';
        const price = item.querySelector('.gws-flights-results__price')?.textContent?.trim() || 'N/A';
        const duration = item.querySelector('.gws-flights-results__duration')?.textContent?.trim() || 'N/A';
        results.push({ airline, price, duration });
      });
      return results;
    });

    await browser.close();
    return flights;
  } catch (error) {
    console.error('Flight scraping error:', error);
    await browser.close();
    return [{ airline: 'Error', price: 'Unable to fetch', duration: 'N/A' }];
  }
};

// Function to scrape hotel prices from Booking.com
const getHotelPrices = async (destination, dates) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const checkin = dates.start;
    const checkout = dates.end;
    const url = `https://www.booking.com/searchresults.en-gb.html?ss=${encodeURIComponent(destination)}&checkin=${checkin}&checkout=${checkout}&group_adults=2&no_rooms=1&group_children=0`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for results
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 });

    // Scrape hotel data
    const hotels = await page.evaluate(() => {
      const results = [];
      const cards = document.querySelectorAll('[data-testid="property-card"]');
      cards.forEach((card, index) => {
        if (index >= 3) return; // Top 3
        const name = card.querySelector('[data-testid="title"]')?.textContent?.trim() || 'Unknown';
        const price = card.querySelector('[data-testid="price-and-discounted-price"]')?.textContent?.trim() || 'N/A';
        const rating = card.querySelector('[data-testid="review-score"]')?.textContent?.trim() || 'N/A';
        results.push({ name, price, rating });
      });
      return results;
    });

    await browser.close();
    return hotels;
  } catch (error) {
    console.error('Hotel scraping error:', error);
    await browser.close();
    return [{ name: 'Error', price: 'Unable to fetch', rating: 'N/A' }];
  }
};

// Function to get weather for destination
const getWeatherForTrip = async (destination) => {
  try {
    const response = await axios.get(`https://wttr.in/${encodeURIComponent(destination)}?format=j1`, { timeout: 10000 });
    const weatherData = response.data;
    const current = weatherData.current_condition[0];
    return {
      temperature: current.temp_C,
      description: current.weatherDesc[0].value,
      humidity: current.humidity
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return { temperature: 'N/A', description: 'Unable to fetch', humidity: 'N/A' };
  }
};

// Main trip planning function
export const planTrip = async (req, res) => {
  try {
    const { destination, userId } = req.body;

    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    // Get user location
    const user = await User.findById(userId);
    const fromLocation = user?.location || 'Delhi';

    // Get dates
    const dates = getNextWeekendDates();

    // Run all tasks in parallel
    const [flights, hotels, weather] = await Promise.all([
      getFlightPrices(fromLocation, destination, dates),
      getHotelPrices(destination, dates),
      getWeatherForTrip(destination)
    ]);

    // Compile plan
    const plan = {
      destination,
      dates,
      from: fromLocation,
      weather,
      flights: flights.slice(0, 3), // Top 3
      hotels: hotels.slice(0, 3), // Top 3
      summary: `Trip to ${destination} from ${fromLocation} for ${dates.start} to ${dates.end}. Weather: ${weather.description}, ${weather.temperature}°C.`
    };

    res.status(200).json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Trip planning error:', error);
    res.status(500).json({
      error: 'Failed to plan trip',
      details: error.message
    });
  }
};
