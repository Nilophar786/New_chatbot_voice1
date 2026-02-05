import express from 'express';
import { planTrip } from '../controllers/autonomous.controllers.js';

const router = express.Router();

// Route for planning trips
router.post('/plan-trip', planTrip);

export default router;
