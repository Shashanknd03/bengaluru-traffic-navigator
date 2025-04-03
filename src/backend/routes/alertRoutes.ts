
import express from 'express';
import { 
  getAllAlerts, 
  getAlertsByArea, 
  createAlert,
  updateAlert,
  closeAlert
} from '../controllers/alertController';

const router = express.Router();

// Define routes correctly
router.get('/', getAllAlerts);
router.get('/area', getAlertsByArea);
router.post('/', createAlert);
router.put('/:id', updateAlert);
router.patch('/:id/close', closeAlert);

export default router;
