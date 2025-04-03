
import mongoose, { Document, Schema } from 'mongoose';

export interface ITrafficAlert extends Document {
  type: 'accident' | 'construction' | 'event' | 'weatherHazard' | 'roadClosure';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  startTime: Date;
  endTime?: Date;
  severity: 'critical' | 'major' | 'minor';
  affectedRoads: string[];
}

const TrafficAlertSchema = new Schema<ITrafficAlert>({
  type: { 
    type: String, 
    enum: ['accident', 'construction', 'event', 'weatherHazard', 'roadClosure'], 
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
  affectedRoads: [{ type: String }]
});

export default mongoose.model<ITrafficAlert>('TrafficAlert', TrafficAlertSchema);
