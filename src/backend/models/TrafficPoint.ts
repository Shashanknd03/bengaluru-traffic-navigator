
import mongoose, { Document, Schema } from 'mongoose';
import { TrafficLevel } from '../../types/traffic';

export interface ITrafficPoint extends Document {
  location: {
    lat: number;
    lng: number;
  };
  status: TrafficLevel;
  speedKmph: number;
  timestamp: Date;
  roadName: string;
}

const TrafficPointSchema = new Schema<ITrafficPoint>({
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'severe'], 
    required: true 
  },
  speedKmph: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  roadName: { type: String, required: true }
});

export default mongoose.model<ITrafficPoint>('TrafficPoint', TrafficPointSchema);
