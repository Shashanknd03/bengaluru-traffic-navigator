
import express from 'express';
import { 
  recordMetrics,
  getLatestMetricsByArea,
  getHistoricalMetrics,
  getTrafficOverview,
  predictTraffic
} from '../controllers/metricsController';

const router = express.Router();

// Define routes
router.post('/', recordMetrics);
router.get('/area', getLatestMetricsByArea);
router.get('/historical', getHistoricalMetrics);
router.get('/overview', getTrafficOverview);
router.get('/predict', predictTraffic);

export default router;
