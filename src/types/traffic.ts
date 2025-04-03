
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
  type: 'accident' | 'construction' | 'event' | 'weatherHazard' | 'roadClosure';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  startTime: string;
  endTime?: string;
  severity: 'critical' | 'major' | 'minor';
  affectedRoads: string[];
}
