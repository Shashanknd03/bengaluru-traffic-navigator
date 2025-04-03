
import { Request, Response, NextFunction } from 'express';
import TrafficAlert from '../models/TrafficAlert';
import { ITrafficAlert } from '../models/TrafficAlert';

// Get all traffic alerts
export const getAllAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 50, severity, type, source } = req.query;
    
    // Build query based on provided filters
    const query: any = {
      $or: [
        { endTime: { $exists: false } },
        { endTime: { $gt: new Date() } }
      ]
    };
    
    // Add optional filters
    if (severity) query.severity = severity;
    if (type) query.type = type;
    if (source) query.source = source;
    
    const alerts = await TrafficAlert.find(query)
      .sort({ severity: 1, startTime: -1 })
      .limit(Number(limit));
    
    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

// Get alerts by area
export const getAlertsByArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { north, south, east, west, limit = 50 } = req.query;
    
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
    })
    .sort({ severity: 1, startTime: -1 })
    .limit(Number(limit));

    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

// Get alerts near a point
export const getAlertsByProximity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng, radius = 1000, limit = 20 } = req.query; // radius in meters
    
    if (!lat || !lng) {
      res.status(400).json({ message: 'Missing location coordinates' });
      return;
    }

    const alerts = await TrafficAlert.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius)
        }
      },
      $or: [
        { endTime: { $exists: false } },
        { endTime: { $gt: new Date() } }
      ]
    })
    .sort({ severity: 1 })
    .limit(Number(limit));

    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

// Create new alert
export const createAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alertData = req.body;
    
    // Add system timestamp if not provided
    if (!alertData.startTime) {
      alertData.startTime = new Date();
    }
    
    const alert: ITrafficAlert = new TrafficAlert(alertData);
    await alert.save();
    
    // Notification and event processing would be added here in a real implementation
    // This would include WebSocket broadcasts, push notifications, etc.
    
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

    // Notification logic for alert updates would go here
    
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

// Get alert statistics
export const getAlertStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timeframe = 'day' } = req.query;
    
    let timeFilter: any = {};
    const now = new Date();
    
    // Set timeframe filter
    if (timeframe === 'hour') {
      timeFilter = { startTime: { $gte: new Date(now.getTime() - 60 * 60 * 1000) } };
    } else if (timeframe === 'day') {
      timeFilter = { startTime: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
    } else if (timeframe === 'week') {
      timeFilter = { startTime: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (timeframe === 'month') {
      timeFilter = { startTime: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
    }
    
    // Get counts by type and severity
    const typeStats = await TrafficAlert.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const severityStats = await TrafficAlert.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get count of current active alerts
    const activeCount = await TrafficAlert.countDocuments({
      $or: [
        { endTime: { $exists: false } },
        { endTime: { $gt: new Date() } }
      ]
    });
    
    // Get hourly distribution
    const hourlyDistribution = await TrafficAlert.aggregate([
      { $match: timeFilter },
      {
        $group: {
          _id: { $hour: '$startTime' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      activeAlerts: activeCount,
      byType: typeStats,
      bySeverity: severityStats,
      hourlyDistribution
    });
  } catch (error) {
    next(error);
  }
};
