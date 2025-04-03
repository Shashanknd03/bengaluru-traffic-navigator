
import { Request, Response, NextFunction } from 'express';
import TrafficAlert from '../models/TrafficAlert';
import { ITrafficAlert } from '../models/TrafficAlert';

// Get all traffic alerts
export const getAllAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alerts = await TrafficAlert.find({
      $or: [
        { endTime: { $exists: false } },
        { endTime: { $gt: new Date() } }
      ]
    }).sort({ severity: 1, startTime: -1 });
    
    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

// Get alerts by area
export const getAlertsByArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { north, south, east, west } = req.query;
    
    if (!north || !south || !east || !west) {
      res.status(400).json({ message: 'Missing coordinates for bounding box' });
      return;
    }

    const alerts = await TrafficAlert.find({
      'location.lat': { $gte: Number(south), $lte: Number(north) },
      'location.lng': { $gte: Number(west), $lte: Number(east) },
      $or: [
        { endTime: { $exists: false } },
        { endTime: { $gt: new Date() } }
      ]
    }).sort({ severity: 1, startTime: -1 });

    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

// Create new alert
export const createAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alert: ITrafficAlert = new TrafficAlert(req.body);
    await alert.save();
    
    // Here you could add notification logic
    
    res.status(201).json(alert);
  } catch (error) {
    next(error);
  }
};

// Update alert
export const updateAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedAlert = await TrafficAlert.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAlert) {
      res.status(404).json({ message: 'Alert not found' });
      return;
    }

    res.status(200).json(updatedAlert);
  } catch (error) {
    next(error);
  }
};

// Close alert
export const closeAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const alert = await TrafficAlert.findById(id);

    if (!alert) {
      res.status(404).json({ message: 'Alert not found' });
      return;
    }

    alert.endTime = new Date();
    await alert.save();

    res.status(200).json(alert);
  } catch (error) {
    next(error);
  }
};
