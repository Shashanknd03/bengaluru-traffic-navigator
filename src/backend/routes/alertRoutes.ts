
import express from 'express';
import { 
  getAllAlerts, 
  getAlertsByArea,
  getAlertsByProximity,
  createAlert,
  updateAlert,
  closeAlert,
  getAlertStatistics
} from '../controllers/alertController';

const router = express.Router();

// Define routes
router.get('/', getAllAlerts);
router.get('/area', getAlertsByArea);
router.get('/proximity', getAlertsByProximity);
router.get('/statistics', getAlertStatistics);
router.post('/', createAlert);
router.put('/:id', updateAlert);
router.patch('/:id/close', closeAlert);

export default router;
