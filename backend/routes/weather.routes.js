import express from 'express';
import { getWeather } from '../controllers/weather.controllers.js';

const router = express.Router();

// GET /api/weather - Get weather for default city (London)
router.get('/', getWeather);

// GET /api/weather/:city - Get weather for a specific city
router.get('/:city', getWeather);

export default router;
