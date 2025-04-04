
export interface GeoLocation {
  lat: number;
  lng: number;
}

export type TrafficStatus = 'low' | 'medium' | 'high' | 'severe';

export interface TrafficPoint {
  id: string;
  location: GeoLocation;
  roadName: string;
  speedKmph: number;
  status: TrafficStatus;
  timestamp: string;
  vehicleCount?: number;
}

export interface Intersection {
  id: string;
  name: string;
  location: GeoLocation;
  status: TrafficStatus;
  signalWorking: boolean;
  connections: string[]; // IDs of connected road segments
}

export interface TrafficPrediction {
  id: string;
  location: GeoLocation;
  roadName: string;
  predictedStatus: TrafficStatus;
  timeFrame: string; // e.g., "next hour", "2 hours", etc.
  confidence: number; // Prediction confidence percentage
}

export interface TrafficAlert {
  id: string;
  type: 'accident' | 'construction' | 'event' | 'closure' | 'hazard';
  location: GeoLocation;
  roadName: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  timestamp: string;
  estimatedResolutionTime?: string;
  affectedArea?: GeoLocation[]; // Polygon representing affected area
}

export interface EmergencyVehicle {
  id: string;
  type: 'ambulance' | 'police' | 'fire';
  location: GeoLocation;
  heading: number; // Direction in degrees
  speed: number;
  priority: 'low' | 'medium' | 'high';
  destination?: GeoLocation;
}

export interface TrafficMetrics {
  id: string;
  timestamp: string;
  averageSpeed: number;
  congestionLevel: number; // Percentage
  vehicleCount: number;
  incidentCount: number;
  emergencyResponseTime: number; // In minutes
  topCongestionAreas: {
    areaName: string;
    level: number;
  }[];
}

export interface TrafficPredictionDetail {
  id: string;
  roadSegmentId: string;
  timeFrames: {
    timeFrame: string;
    predictedStatus: TrafficStatus;
    predictedSpeed: number;
    confidence: number;
  }[];
  factors: {
    factor: string;
    impact: number;
  }[];
  historicalAccuracy: number;
}

export interface RoadSegment {
  id: string;
  name: string;
  startPoint: GeoLocation;
  endPoint: GeoLocation;
  length: number; // in kilometers
  lanes: number;
  speedLimit: number;
  currentStatus: TrafficStatus;
  direction: 'oneway' | 'twoway';
  type: 'highway' | 'arterial' | 'collector' | 'local';
}

export interface TrafficIncident {
  id: string;
  type: 'accident' | 'breakdown' | 'debris' | 'construction' | 'event';
  location: GeoLocation;
  roadSegmentId: string;
  description: string;
  status: 'active' | 'resolved' | 'inProgress';
  reportedAt: string;
  resolvedAt?: string;
  impactLevel: 'low' | 'medium' | 'high';
  affectedLanes: number;
}

export interface SensorData {
  id: string;
  type: 'camera' | 'induction' | 'radar' | 'bluetooth';
  location: GeoLocation;
  status: 'active' | 'inactive' | 'maintenance';
  lastReport: string;
  batteryLevel?: number;
  calibrationDate?: string;
}

export interface TrafficSystem {
  id: string;
  name: string;
  type: 'signal' | 'sign' | 'sensor' | 'camera';
  location: GeoLocation;
  status: 'operational' | 'maintenance' | 'failure';
  lastMaintenance: string;
  installationDate: string;
  manufacturer: string;
}

export interface TrafficSignalTiming {
  intersectionId: string;
  cycles: {
    direction: 'north-south' | 'east-west' | 'left-turn' | 'pedestrian';
    greenDuration: number; // seconds
    yellowDuration: number; // seconds
    redDuration: number; // seconds
  }[];
  adaptiveTiming: boolean;
  peakHoursOverride: boolean;
  lastOptimized: string;
}
