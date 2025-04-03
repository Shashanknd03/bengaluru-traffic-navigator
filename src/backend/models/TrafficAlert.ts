
import mongoose, { Document, Schema } from 'mongoose';

export interface ITrafficAlert extends Document {
  type: 'accident' | 'construction' | 'event' | 'weatherHazard' | 'roadClosure' | 'congestion' | 'emergency' | 'systemAlert';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  startTime: Date;
  endTime?: Date;
  severity: 'critical' | 'major' | 'minor';
  affectedRoads: string[];
  impactRadius?: number; // in meters
  source?: 'sensor' | 'user' | 'authority' | 'prediction' | 'emergency';
  metadata?: Record<string, any>; // For additional data specific to alert types
  eventId?: string; // For linking related alerts
  mediaUrls?: string[]; // For images or videos of incidents
  trafficImpact?: {
    estimatedDelay: number; // in minutes
    alternativeRoutes: boolean;
  };
}

const TrafficAlertSchema = new Schema<ITrafficAlert>({
  type: { 
    type: String, 
    enum: ['accident', 'construction', 'event', 'weatherHazard', 'roadClosure', 'congestion', 'emergency', 'systemAlert'], 
    required: true 
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  description: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  severity: { 
    type: String, 
    enum: ['critical', 'major', 'minor'], 
    required: true 
  },
  affectedRoads: [{ type: String }],
  impactRadius: { type: Number },
  source: { 
    type: String, 
    enum: ['sensor', 'user', 'authority', 'prediction', 'emergency'],
  },
  metadata: { type: Map, of: Schema.Types.Mixed },
  eventId: { type: String },
  mediaUrls: [{ type: String }],
  trafficImpact: {
    estimatedDelay: { type: Number },
    alternativeRoutes: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Index for geospatial queries
TrafficAlertSchema.index({ 'location': '2dsphere' });
// Index for active alerts (where endTime is null or in the future)
TrafficAlertSchema.index({ 
  endTime: 1,
  startTime: -1,
  severity: 1
});

export default mongoose.model<ITrafficAlert>('TrafficAlert', TrafficAlertSchema);
