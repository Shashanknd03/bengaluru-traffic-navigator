
import { Request, Response, NextFunction } from 'express';
import TrafficMetrics from '../models/TrafficMetrics';
import TrafficPoint from '../models/TrafficPoint';
import { ITrafficMetrics } from '../models/TrafficMetrics';

// Record new traffic metrics
export const recordMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metricsData = req.body;
    
    // Add timestamp if not provided
    if (!metricsData.timestamp) {
      metricsData.timestamp = new Date();
    }
    
    const metrics: ITrafficMetrics = new TrafficMetrics(metricsData);
    await metrics.save();
    
    res.status(201).json(metrics);
  } catch (error) {
    next(error);
  }
};

// Get latest metrics for a specific area
export const getLatestMetricsByArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { north, south, east, west } = req.query;
    
    if (!north || !south || !east || !west) {
      res.status(400).json({ message: 'Missing coordinates for bounding box' });
      return;
    }

    // Get the latest metrics for each unique location within the bounding box
    const metrics = await TrafficMetrics.aggregate([
      {
        $match: {
          'location.lat': { $gte: Number(south), $lte: Number(north) },
          'location.lng': { $gte: Number(west), $lte: Number(east) },
          timestamp: { $gte: new Date(Date.now() - 15 * 60 * 1000) } // Last 15 minutes
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$roadSegmentId',
          latestMetric: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$latestMetric' }
      }
    ]);

    res.status(200).json(metrics);
  } catch (error) {
    next(error);
  }
};

// Get historical metrics for a road segment
export const getHistoricalMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roadSegmentId, interval = 'hour', duration = '24h' } = req.query;
    
    if (!roadSegmentId) {
      res.status(400).json({ message: 'Missing roadSegmentId parameter' });
      return;
    }
    
    // Calculate time range based on duration
    let timeStart = new Date();
    const durationStr = duration as string;
    if (durationStr.endsWith('h')) {
      const hours = parseInt(durationStr);
      timeStart = new Date(Date.now() - hours * 60 * 60 * 1000);
    } else if (durationStr.endsWith('d')) {
      const days = parseInt(durationStr);
      timeStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    } else if (durationStr.endsWith('w')) {
      const weeks = parseInt(durationStr);
      timeStart = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);
    }
    
    // Define grouping based on interval
    let timeFormat: any;
    if (interval === '5min') {
      timeFormat = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' },
        hour: { $hour: '$timestamp' },
        interval: { $subtract: [{ $minute: '$timestamp' }, { $mod: [{ $minute: '$timestamp' }, 5] }] }
      };
    } else if (interval === '15min') {
      timeFormat = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' },
        hour: { $hour: '$timestamp' },
        interval: { $subtract: [{ $minute: '$timestamp' }, { $mod: [{ $minute: '$timestamp' }, 15] }] }
      };
    } else if (interval === 'hour') {
      timeFormat = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' },
        hour: { $hour: '$timestamp' }
      };
    } else if (interval === 'day') {
      timeFormat = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' }
      };
    }
    
    const metrics = await TrafficMetrics.aggregate([
      {
        $match: {
          roadSegmentId: roadSegmentId as string,
          timestamp: { $gte: timeStart }
        }
      },
      {
        $group: {
          _id: timeFormat,
          averageSpeed: { $avg: '$metrics.averageSpeed' },
          avgVehicleCount: { $avg: '$metrics.vehicleCount' },
          avgCongestionLevel: { $avg: '$metrics.congestionLevel' },
          avgTrafficDensity: { $avg: '$metrics.trafficDensity' },
          samples: { $sum: 1 },
          timestamp: { $min: '$timestamp' }
        }
      },
      {
        $sort: { timestamp: 1 }
      },
      {
        $project: {
          _id: 0,
          timestamp: 1,
          averageSpeed: 1,
          avgVehicleCount: 1,
          avgCongestionLevel: 1,
          avgTrafficDensity: 1,
          samples: 1
        }
      }
    ]);

    res.status(200).json(metrics);
  } catch (error) {
    next(error);
  }
};

// Get overall traffic statistics
export const getTrafficOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Current time minus 1 hour
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);
    
    // Calculate average metrics across the system
    const systemMetrics = await TrafficMetrics.aggregate([
      {
        $match: {
          timestamp: { $gte: lastHour }
        }
      },
      {
        $group: {
          _id: null,
          avgSpeed: { $avg: '$metrics.averageSpeed' },
          totalVehicles: { $sum: '$metrics.vehicleCount' },
          avgCongestion: { $avg: '$metrics.congestionLevel' },
          sensorCount: { $addToSet: '$sensors.id' },
          lastUpdate: { $max: '$timestamp' }
        }
      },
      {
        $project: {
          _id: 0,
          avgSpeed: 1,
          totalVehicles: 1,
          avgCongestion: 1,
          sensorCount: { $size: '$sensorCount' },
          lastUpdate: 1
        }
      }
    ]);
    
    // Count active traffic points
    const activePoints = await TrafficPoint.countDocuments({
      timestamp: { $gte: lastHour }
    });
    
    // Get congestion by area
    const congestionByArea = await TrafficMetrics.aggregate([
      {
        $match: {
          timestamp: { $gte: lastHour }
        }
      },
      {
        $group: {
          _id: '$roadSegmentId',
          avgCongestion: { $avg: '$metrics.congestionLevel' },
          lat: { $first: '$location.lat' },
          lng: { $first: '$location.lng' }
        }
      },
      {
        $match: {
          avgCongestion: { $gte: 0.7 } // Only include highly congested areas
        }
      },
      {
        $sort: { avgCongestion: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          roadSegmentId: '$_id',
          avgCongestion: 1,
          location: {
            lat: '$lat',
            lng: '$lng'
          }
        }
      }
    ]);
    
    res.status(200).json({
      systemMetrics: systemMetrics[0] || {
        avgSpeed: 0,
        totalVehicles: 0,
        avgCongestion: 0,
        sensorCount: 0,
        lastUpdate: new Date()
      },
      activePoints,
      congestionHotspots: congestionByArea
    });
  } catch (error) {
    next(error);
  }
};

// Predict traffic for the next hour
export const predictTraffic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real system, this would use ML models
    // For demonstration, we'll return a simplified prediction based on current data
    
    const { roadSegmentId } = req.query;
    
    if (!roadSegmentId) {
      res.status(400).json({ message: 'Missing roadSegmentId parameter' });
      return;
    }
    
    // Get current metrics for the road segment
    const currentMetrics = await TrafficMetrics.findOne({ 
      roadSegmentId: roadSegmentId as string 
    })
    .sort({ timestamp: -1 });
    
    if (!currentMetrics) {
      res.status(404).json({ message: 'No metrics found for this road segment' });
      return;
    }
    
    // Simple prediction algorithm (would be replaced with ML model)
    const now = new Date();
    const hourOfDay = now.getHours();
    const dayOfWeek = now.getDay(); // 0 is Sunday
    
    // Simulate rush hour pattern
    let congestionMultiplier = 1.0;
    
    // Weekday morning rush hour (7-10 AM)
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hourOfDay >= 7 && hourOfDay < 10) {
      congestionMultiplier = 1.5;
    }
    // Weekday evening rush hour (4-7 PM)
    else if (dayOfWeek >= 1 && dayOfWeek <= 5 && hourOfDay >= 16 && hourOfDay < 19) {
      congestionMultiplier = 1.7;
    }
    // Weekend afternoons
    else if ((dayOfWeek === 0 || dayOfWeek === 6) && hourOfDay >= 12 && hourOfDay < 18) {
      congestionMultiplier = 1.3;
    }
    // Late night
    else if (hourOfDay >= 22 || hourOfDay < 5) {
      congestionMultiplier = 0.6;
    }
    
    const prediction = {
      roadSegmentId: roadSegmentId,
      currentMetrics: {
        averageSpeed: currentMetrics.metrics.averageSpeed,
        congestionLevel: currentMetrics.metrics.congestionLevel,
        vehicleCount: currentMetrics.metrics.vehicleCount
      },
      predictions: [
        {
          timeframe: '15min',
          averageSpeed: Math.max(5, currentMetrics.metrics.averageSpeed * (1 / (congestionMultiplier * 0.9))),
          congestionLevel: Math.min(1, currentMetrics.metrics.congestionLevel * congestionMultiplier * 0.9),
          confidence: 0.85
        },
        {
          timeframe: '30min',
          averageSpeed: Math.max(5, currentMetrics.metrics.averageSpeed * (1 / congestionMultiplier)),
          congestionLevel: Math.min(1, currentMetrics.metrics.congestionLevel * congestionMultiplier),
          confidence: 0.75
        },
        {
          timeframe: '60min',
          averageSpeed: Math.max(5, currentMetrics.metrics.averageSpeed * (1 / (congestionMultiplier * 1.1))),
          congestionLevel: Math.min(1, currentMetrics.metrics.congestionLevel * congestionMultiplier * 1.1),
          confidence: 0.65
        }
      ],
      timestamp: new Date()
    };
    
    res.status(200).json(prediction);
  } catch (error) {
    next(error);
  }
};
