
import express from 'express';
import { 
  getAllTrafficPoints, 
  getTrafficPointsByArea, 
  addTrafficPoint,
  getTrafficMetrics
} from '../controllers/trafficController';

const router = express.Router();

// Define routes correctly
router.get('/points', getAllTrafficPoints);
router.get('/points/area', getTrafficPointsByArea);
router.post('/points', addTrafficPoint);
router.get('/metrics', getTrafficMetrics);

export default router;
