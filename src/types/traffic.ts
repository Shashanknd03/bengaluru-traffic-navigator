
export type TrafficLevel = 'low' | 'medium' | 'high' | 'severe';

export interface TrafficPoint {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  status: TrafficLevel;
  speedKmph: number;
  timestamp: string;
  roadName: string;
}

export interface Intersection {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  name: string;
  status: TrafficLevel;
  signalTimings: {
    northSouth: number;
    eastWest: number;
  };
  cameras: boolean;
  sensors: boolean;
}

export interface TrafficPrediction {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  currentStatus: TrafficLevel;
  predictedStatus: TrafficLevel;
  timeFrame: string;
  confidence: number;
}

export interface EmergencyVehicle {
  id: string;
  type: 'ambulance' | 'police' | 'fire';
  location: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  estimatedArrivalTime: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Route {
  id: string;
  startLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  endLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  distance: number;
  estimatedTime: number;
  trafficLevel: TrafficLevel;
  alternativeRoutes: number;
}

export interface TrafficMetrics {
  averageSpeed: number;
  congestionLevel: number;
  vehicleCount: number;
  timestamp: string;
}

export interface TrafficAlert {
  id: string;
  type: 'accident' | 'construction' | 'event' | 'weatherHazard' | 'roadClosure' | 'congestion' | 'emergency' | 'systemAlert';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  startTime: string;
  endTime?: string;
  severity: 'critical' | 'major' | 'minor';
  affectedRoads: string[];
  impactRadius?: number;
  source?: 'sensor' | 'user' | 'authority' | 'prediction' | 'emergency';
  metadata?: Record<string, any>;
  eventId?: string;
  mediaUrls?: string[];
  trafficImpact?: {
    estimatedDelay: number;
    alternativeRoutes: boolean;
  };
}

export interface RoadSegment {
  id: string;
  name: string;
  points: Array<{
    lat: number;
    lng: number;
  }>;
  length: number; // in kilometers
  lanes: number;
  speedLimit: number;
  type: 'highway' | 'arterial' | 'collector' | 'local';
  status: TrafficLevel;
}

export interface TrafficPredictionDetail {
  id: string;
  roadSegmentId: string;
  currentStatus: {
    averageSpeed: number;
    congestionLevel: number;
    vehicleCount: number;
  };
  predictions: Array<{
    timeframe: string; // e.g., '15min', '30min', '60min'
    averageSpeed: number;
    congestionLevel: number;
    confidence: number;
  }>;
  timestamp: string;
}

export interface TrafficIncident {
  id: string;
  type: 'accident' | 'breakdown' | 'obstacle' | 'roadwork' | 'hazard';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  reportTime: string;
  resolvedTime?: string;
  severity: 'critical' | 'major' | 'minor';
  impactRadius: number;
  reportedBy: string;
  status: 'active' | 'resolved' | 'inProgress';
}

export interface SensorData {
  id: string;
  type: 'camera' | 'induction' | 'radar' | 'infrared' | 'bluetooth';
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'inactive' | 'maintenance' | 'degraded';
  lastReading: string;
  battery?: number;
  coverage: {
    radius: number;
    direction?: number;
  };
  metrics: {
    vehicleCount: number;
    averageSpeed: number;
    occupancy?: number;
  };
}

export interface TrafficSystem {
  id: string;
  name: string;
  type: 'signal' | 'camera' | 'display' | 'sensor';
  location: {
    lat: number;
    lng: number;
  };
  status: 'operational' | 'maintenance' | 'offline' | 'degraded';
  lastMaintenance: string;
  nextMaintenance: string;
  controlledBy: string;
  configuration: Record<string, any>;
}

export interface TrafficSignalTiming {
  intersectionId: string;
  schedule: Array<{
    timeOfDay: {
      start: string; // HH:MM format
      end: string;
    };
    timings: {
      northSouth: number;
      eastWest: number;
      leftTurn: number;
      pedestrian: number;
    };
    isAdaptive: boolean;
  }>;
  currentPhase: string;
  lastUpdated: string;
  optimizationStatus: 'optimized' | 'default' | 'manual' | 'emergency';
}

export interface TrafficSimulation {
  id: string;
  name: string;
  scenario: string;
  parameters: Record<string, any>;
  results: {
    averageSpeedImprovement: number;
    congestionReduction: number;
    travelTimeReduction: number;
  };
  timestamp: string;
  createdBy: string;
}
