
import { 
  TrafficPoint, 
  Intersection, 
  TrafficPrediction, 
  TrafficMetrics, 
  TrafficAlert, 
  Route,
  EmergencyVehicle
} from '../types/traffic';

// Bengaluru coordinates
const BENGALURU_CENTER = { lat: 12.9716, lng: 77.5946 };

// Generate points around Bengaluru center
const generatePointsAround = (center: {lat: number, lng: number}, count: number, radius: number) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    // Random angle
    const angle = Math.random() * Math.PI * 2;
    // Random radius (to distribute points)
    const randomRadius = Math.random() * radius;
    // Convert to cartesian
    const x = randomRadius * Math.cos(angle);
    const y = randomRadius * Math.sin(angle);
    // Add to center
    points.push({
      lat: center.lat + (y / 111), // 1 degree latitude is approximately 111 km
      lng: center.lng + (x / (111 * Math.cos(center.lat * (Math.PI / 180)))), // 1 degree longitude varies with latitude
    });
  }
  return points;
};

const ROAD_NAMES = [
  'MG Road',
  'Outer Ring Road',
  'Hosur Road',
  'Bannerghatta Road',
  'Old Madras Road',
  'Tumkur Road',
  'Mysore Road',
  'Bellary Road',
  'Electronic City Expressway',
  'Airport Road',
  'Whitefield Road',
  'Sarjapur Road',
  'Hennur Road',
  'KR Puram Road',
  'Cunningham Road',
  'Richmond Road',
  'Residency Road'
];

const getRandomRoadName = () => {
  return ROAD_NAMES[Math.floor(Math.random() * ROAD_NAMES.length)];
};

const getRandomTrafficLevel = (): 'low' | 'medium' | 'high' | 'severe' => {
  const levels = ['low', 'medium', 'high', 'severe'];
  return levels[Math.floor(Math.random() * levels.length)] as 'low' | 'medium' | 'high' | 'severe';
};

const getSpeedForTrafficLevel = (level: 'low' | 'medium' | 'high' | 'severe'): number => {
  switch (level) {
    case 'low': return 40 + Math.floor(Math.random() * 20); // 40-60
    case 'medium': return 25 + Math.floor(Math.random() * 15); // 25-40
    case 'high': return 10 + Math.floor(Math.random() * 15); // 10-25
    case 'severe': return Math.floor(Math.random() * 10); // 0-10
    default: return 30;
  }
};

// Generate mock traffic points
export const generateMockTrafficPoints = (count: number): TrafficPoint[] => {
  const points = generatePointsAround(BENGALURU_CENTER, count, 0.1);
  
  return points.map((point, index) => {
    const status = getRandomTrafficLevel();
    return {
      id: `tp-${index}`,
      location: point,
      status,
      speedKmph: getSpeedForTrafficLevel(status),
      timestamp: new Date().toISOString(),
      roadName: getRandomRoadName()
    };
  });
};

// Generate mock intersections
export const generateMockIntersections = (count: number): Intersection[] => {
  const points = generatePointsAround(BENGALURU_CENTER, count, 0.08);
  
  return points.map((point, index) => {
    const status = getRandomTrafficLevel();
    return {
      id: `int-${index}`,
      location: point,
      name: `Intersection ${String.fromCharCode(65 + index % 26)}`,
      status,
      signalTimings: {
        northSouth: 30 + Math.floor(Math.random() * 60),
        eastWest: 30 + Math.floor(Math.random() * 60)
      },
      cameras: Math.random() > 0.3,
      sensors: Math.random() > 0.2
    };
  });
};

// Generate mock traffic predictions
export const generateMockTrafficPredictions = (count: number): TrafficPrediction[] => {
  const points = generatePointsAround(BENGALURU_CENTER, count, 0.09);
  
  return points.map((point, index) => {
    const currentStatus = getRandomTrafficLevel();
    let predictedStatus = getRandomTrafficLevel();
    // Sometimes make prediction worse than current
    if (Math.random() > 0.7) {
      const levels = ['low', 'medium', 'high', 'severe'];
      const currentIndex = levels.indexOf(currentStatus);
      const nextIndex = Math.min(levels.length - 1, currentIndex + 1);
      predictedStatus = levels[nextIndex] as 'low' | 'medium' | 'high' | 'severe';
    }
    
    return {
      id: `pred-${index}`,
      location: point,
      currentStatus,
      predictedStatus,
      timeFrame: `${Math.floor(Math.random() * 3) + 1} hours`,
      confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
    };
  });
};

// Generate mock traffic metrics
export const generateMockTrafficMetrics = (): TrafficMetrics => {
  return {
    averageSpeed: 15 + Math.floor(Math.random() * 25),
    congestionLevel: Math.floor(Math.random() * 100),
    vehicleCount: 5000 + Math.floor(Math.random() * 15000),
    timestamp: new Date().toISOString()
  };
};

// Generate mock traffic alerts
export const generateMockTrafficAlerts = (count: number): TrafficAlert[] => {
  const alertTypes = ['accident', 'construction', 'event', 'weatherHazard', 'roadClosure'];
  const severityLevels = ['critical', 'major', 'minor'];
  const points = generatePointsAround(BENGALURU_CENTER, count, 0.1);
  
  return points.map((point, index) => {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)] as 'accident' | 'construction' | 'event' | 'weatherHazard' | 'roadClosure';
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)] as 'critical' | 'major' | 'minor';
    
    // Generate descriptive text based on alert type
    let description = '';
    switch (type) {
      case 'accident':
        description = `${Math.floor(Math.random() * 3) + 2}-vehicle collision`;
        break;
      case 'construction':
        description = `Road widening project - ${Math.floor(Math.random() * 3) + 1} lanes closed`;
        break;
      case 'event':
        description = `Public gathering at ${['Freedom Park', 'Cubbon Park', 'Lalbagh', 'Palace Grounds'][Math.floor(Math.random() * 4)]}`;
        break;
      case 'weatherHazard':
        description = `${['Heavy rain', 'Flooding', 'Fallen tree'][Math.floor(Math.random() * 3)]} causing slow traffic`;
        break;
      case 'roadClosure':
        description = `Full road closure for ${['metro construction', 'bridge repair', 'utility work'][Math.floor(Math.random() * 3)]}`;
        break;
    }
    
    return {
      id: `alert-${index}`,
      type,
      location: point,
      description,
      startTime: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
      endTime: Math.random() > 0.3 ? new Date(Date.now() + Math.floor(Math.random() * 7200000)).toISOString() : undefined,
      severity,
      affectedRoads: Array(Math.floor(Math.random() * 3) + 1)
        .fill(0)
        .map(() => getRandomRoadName())
    };
  });
};

// Generate mock routes
export const generateMockRoutes = (count: number): Route[] => {
  return Array(count).fill(0).map((_, index) => {
    const startLocation = generatePointsAround(BENGALURU_CENTER, 1, 0.1)[0];
    const endLocation = generatePointsAround(BENGALURU_CENTER, 1, 0.1)[0];
    const trafficLevel = getRandomTrafficLevel();
    
    // Calculate "distance" based on lat/lng (simplified)
    const latDiff = Math.abs(startLocation.lat - endLocation.lat);
    const lngDiff = Math.abs(startLocation.lng - endLocation.lng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // rough km
    
    // Estimate time based on distance and traffic
    let timeMultiplier;
    switch(trafficLevel) {
      case 'low': timeMultiplier = 1.2; break;
      case 'medium': timeMultiplier = 1.5; break;
      case 'high': timeMultiplier = 2; break;
      case 'severe': timeMultiplier = 3; break;
      default: timeMultiplier = 1;
    }
    
    const estimatedTime = Math.round(distance * timeMultiplier * 2); // minutes
    
    return {
      id: `route-${index}`,
      startLocation: {
        ...startLocation,
        name: `Location ${String.fromCharCode(65 + index)}`,
      },
      endLocation: {
        ...endLocation,
        name: `Destination ${String.fromCharCode(65 + index)}`,
      },
      distance: parseFloat(distance.toFixed(1)),
      estimatedTime,
      trafficLevel,
      alternativeRoutes: Math.floor(Math.random() * 3) + 1,
    };
  });
};

// Generate mock emergency vehicles
export const generateMockEmergencyVehicles = (count: number): EmergencyVehicle[] => {
  const vehicleTypes = ['ambulance', 'police', 'fire'];
  const priorityLevels = ['high', 'medium', 'low'];
  const startPoints = generatePointsAround(BENGALURU_CENTER, count, 0.15);
  const endPoints = generatePointsAround(BENGALURU_CENTER, count, 0.15);
  
  return startPoints.map((startPoint, index) => {
    const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)] as 'ambulance' | 'police' | 'fire';
    const priority = priorityLevels[Math.floor(Math.random() * priorityLevels.length)] as 'high' | 'medium' | 'low';
    
    // Calculate estimated arrival based on distance and priority
    const latDiff = Math.abs(startPoint.lat - endPoints[index].lat);
    const lngDiff = Math.abs(startPoint.lng - endPoints[index].lng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // rough km
    
    // Faster for higher priority
    let minutesPerKm;
    switch(priority) {
      case 'high': minutesPerKm = 0.8; break;
      case 'medium': minutesPerKm = 1.2; break;
      case 'low': minutesPerKm = 1.5; break;
      default: minutesPerKm = 1;
    }
    
    const estimatedMinutes = Math.round(distance * minutesPerKm);
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + estimatedMinutes * 60000);
    
    return {
      id: `ev-${index}`,
      type,
      location: startPoint,
      destination: endPoints[index],
      estimatedArrivalTime: arrivalTime.toISOString(),
      priority
    };
  });
};

// Mock data initialization function
export const initializeMockData = () => {
  return {
    trafficPoints: generateMockTrafficPoints(50),
    intersections: generateMockIntersections(25),
    predictions: generateMockTrafficPredictions(15),
    metrics: generateMockTrafficMetrics(),
    alerts: generateMockTrafficAlerts(8),
    routes: generateMockRoutes(5),
    emergencyVehicles: generateMockEmergencyVehicles(3)
  };
};
