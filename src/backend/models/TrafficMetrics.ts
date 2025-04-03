
import mongoose, { Document, Schema } from 'mongoose';

export interface ITrafficMetrics extends Document {
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
  };
  roadSegmentId?: string;
  metrics: {
    averageSpeed: number;      // km/h
    vehicleCount: number;      // number of vehicles
    congestionLevel: number;   // 0-1 ratio
    trafficDensity: number;    // vehicles per km
    averageWaitTime?: number;  // seconds
  };
  sensors: {
    id: string;
    type: string;
    status: 'active' | 'inactive' | 'degraded';
  }[];
  weatherConditions?: {
    temperature?: number;
    precipitation?: number;
    visibility?: number;
    windSpeed?: number;
  };
}

const TrafficMetricsSchema = new Schema<ITrafficMetrics>({
  timestamp: { type: Date, default: Date.now, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  roadSegmentId: { type: String },
  metrics: {
    averageSpeed: { type: Number, required: true },
    vehicleCount: { type: Number, required: true },
    congestionLevel: { type: Number, required: true },
    trafficDensity: { type: Number, required: true },
    averageWaitTime: { type: Number }
  },
  sensors: [{
    id: { type: String, required: true },
    type: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'degraded'],
      default: 'active'
    }
  }],
  weatherConditions: {
    temperature: { type: Number },
    precipitation: { type: Number },
    visibility: { type: Number },
    windSpeed: { type: Number }
  }
});

// Create indexes for time-series queries
TrafficMetricsSchema.index({ timestamp: -1 });
TrafficMetricsSchema.index({ 'location': '2dsphere' });
TrafficMetricsSchema.index({ roadSegmentId: 1, timestamp: -1 });

export default mongoose.model<ITrafficMetrics>('TrafficMetrics', TrafficMetricsSchema);
