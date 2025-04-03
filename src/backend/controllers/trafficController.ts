
import { Request, Response, NextFunction } from 'express';
import TrafficPoint from '../models/TrafficPoint';
import { ITrafficPoint } from '../models/TrafficPoint';

// Get all traffic points
export const getAllTrafficPoints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trafficPoints = await TrafficPoint.find().sort({ timestamp: -1 });
    res.status(200).json(trafficPoints);
  } catch (error) {
    next(error);
  }
};

// Get traffic points by area (within a bounding box)
export const getTrafficPointsByArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { north, south, east, west } = req.query;
    
    if (!north || !south || !east || !west) {
      return res.status(400).json({ message: 'Missing coordinates for bounding box' });
    }

    const trafficPoints = await TrafficPoint.find({
      'location.lat': { $gte: Number(south), $lte: Number(north) },
      'location.lng': { $gte: Number(west), $lte: Number(east) }
    }).sort({ timestamp: -1 });

    res.status(200).json(trafficPoints);
  } catch (error) {
    next(error);
  }
};

// Add new traffic point
export const addTrafficPoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trafficPoint: ITrafficPoint = new TrafficPoint(req.body);
    await trafficPoint.save();
    res.status(201).json(trafficPoint);
  } catch (error) {
    next(error);
  }
};

// Get traffic metrics
export const getTrafficMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Calculate average speed across all points
    const aggregateResult = await TrafficPoint.aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(Date.now() - 3600000) } // Last hour
        }
      },
      {
        $group: {
          _id: null,
          averageSpeed: { $avg: '$speedKmph' },
          count: { $sum: 1 },
          lowCount: {
            $sum: { $cond: [{ $eq: ['$status', 'low'] }, 1, 0] }
          },
          mediumCount: {
            $sum: { $cond: [{ $eq: ['$status', 'medium'] }, 1, 0] }
          },
          highCount: {
            $sum: { $cond: [{ $eq: ['$status', 'high'] }, 1, 0] }
          },
          severeCount: {
            $sum: { $cond: [{ $eq: ['$status', 'severe'] }, 1, 0] }
          }
        }
      }
    ]);

    const metrics = aggregateResult.length > 0 ? {
      averageSpeed: aggregateResult[0].averageSpeed,
      vehicleCount: aggregateResult[0].count,
      congestionLevel: calculateCongestionLevel(aggregateResult[0]),
      timestamp: new Date()
    } : {
      averageSpeed: 0,
      vehicleCount: 0,
      congestionLevel: 0,
      timestamp: new Date()
    };

    res.status(200).json(metrics);
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate congestion level
const calculateCongestionLevel = (data: any) => {
  const totalPoints = data.count;
  const weightedSum = 
    (data.lowCount * 0.25) + 
    (data.mediumCount * 0.5) + 
    (data.highCount * 0.75) + 
    (data.severeCount * 1);
  
  return totalPoints > 0 ? (weightedSum / totalPoints) : 0;
};
