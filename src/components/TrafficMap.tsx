import React, { useEffect, useRef, useState } from 'react';
import { 
  TrafficPoint, 
  Intersection, 
  TrafficPrediction, 
  TrafficAlert,
  EmergencyVehicle 
} from '../types/traffic';
import { Map, Info, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrafficMapProps {
  trafficPoints: TrafficPoint[];
  intersections: Intersection[];
  predictions: TrafficPrediction[];
  alerts: TrafficAlert[];
  emergencyVehicles: EmergencyVehicle[];
  showTraffic: boolean;
  showIntersections: boolean;
  showPredictions: boolean;
  showAlerts: boolean;
  showEmergencyVehicles: boolean;
}

const TrafficMap: React.FC<TrafficMapProps> = ({ 
  trafficPoints, 
  intersections, 
  predictions, 
  alerts,
  emergencyVehicles,
  showTraffic, 
  showIntersections, 
  showPredictions, 
  showAlerts,
  showEmergencyVehicles
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // This would ideally use a real map API like Google Maps, Mapbox, or Leaflet
  // For this prototype, we'll create a visual representation using HTML/CSS

  useEffect(() => {
    if (mapContainerRef.current && !mapInitialized) {
      setMapInitialized(true);
      // In a real implementation, this is where map initialization would happen
    }
  }, [mapInitialized]);

  // Get color based on traffic status
  const getStatusColor = (status: 'low' | 'medium' | 'high' | 'severe'): string => {
    switch (status) {
      case 'low': return 'bg-traffic-green';
      case 'medium': return 'bg-traffic-amber';
      case 'high': return 'bg-traffic-red';
      case 'severe': return 'bg-red-800';
      default: return 'bg-gray-400';
    }
  };

  const getEmergencyVehicleColor = (type: 'ambulance' | 'police' | 'fire'): string => {
    switch (type) {
      case 'ambulance': return 'bg-red-500';
      case 'police': return 'bg-blue-500';
      case 'fire': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  // Convert lat/lng to relative position in the container
  const getPositionStyle = (lat: number, lng: number) => {
    // Bengaluru approximate boundaries
    const northBound = 13.1;
    const southBound = 12.8;
    const eastBound = 77.8;
    const westBound = 77.4;
    
    // Calculate percentage within bounds
    const leftPercent = ((lng - westBound) / (eastBound - westBound)) * 100;
    const topPercent = ((northBound - lat) / (northBound - southBound)) * 100;
    
    return {
      left: `${Math.min(100, Math.max(0, leftPercent))}%`,
      top: `${Math.min(100, Math.max(0, topPercent))}%`
    };
  };

  return (
    <div className="relative bengaluru-map-container bg-traffic-lightGray">
      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.5946,12.9716,11,0/1000x600?access_token=pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2txOHoxb2k4MDYxbDJ2bnhpZGloZWprcCJ9.lRLjk3y3u1ZwGBxW_jZ9Lw')] bg-cover bg-center opacity-80">
        {/* This would be replaced with an actual map in a real implementation */}
      </div>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md">
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="flex gap-2 items-center">
            <Navigation size={14} />
            <span>Center Map</span>
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2 items-center">
            <Map size={14} />
            <span>Change Style</span>
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2 items-center">
            <Info size={14} />
            <span>Help</span>
          </Button>
        </div>
      </div>
      
      {/* Traffic points */}
      {showTraffic && trafficPoints.map(point => (
        <div 
          key={point.id}
          className={`absolute w-2.5 h-2.5 rounded-full ${getStatusColor(point.status)}`}
          style={getPositionStyle(point.location.lat, point.location.lng)}
          title={`${point.roadName}: ${point.speedKmph} km/h`}
        />
      ))}
      
      {/* Intersections */}
      {showIntersections && intersections.map(intersection => (
        <div 
          key={intersection.id}
          className={`absolute w-4 h-4 rounded-sm border-2 border-white ${getStatusColor(intersection.status)}`}
          style={getPositionStyle(intersection.location.lat, intersection.location.lng)}
          title={`${intersection.name}`}
        />
      ))}
      
      {/* Predictions */}
      {showPredictions && predictions.map(prediction => (
        <div 
          key={prediction.id}
          className={`absolute w-4 h-4 rounded-full border border-white ${getStatusColor(prediction.predictedStatus)} animate-pulse-slow`}
          style={getPositionStyle(prediction.location.lat, prediction.location.lng)}
          title={`Predicted: ${prediction.predictedStatus} (${prediction.timeFrame})`}
        >
          <div className="absolute inset-0 rounded-full border-2 border-white" />
        </div>
      ))}
      
      {/* Alerts */}
      {showAlerts && alerts.map(alert => (
        <div 
          key={alert.id}
          className="absolute w-6 h-6 flex items-center justify-center"
          style={getPositionStyle(alert.location.lat, alert.location.lng)}
          title={`${alert.type}: ${alert.description}`}
        >
          <div className="w-6 h-6 bg-yellow-400 rotate-45 animate-pulse-slow">
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-600">!</div>
          </div>
        </div>
      ))}
      
      {/* Emergency Vehicles */}
      {showEmergencyVehicles && emergencyVehicles.map(vehicle => (
        <div 
          key={vehicle.id}
          className={`absolute w-4 h-4 ${getEmergencyVehicleColor(vehicle.type)} rounded-full animate-pulse-slow border border-white`}
          style={getPositionStyle(vehicle.location.lat, vehicle.location.lng)}
          title={`${vehicle.type} (${vehicle.priority} priority)`}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
            {vehicle.type === 'ambulance' ? 'A' : vehicle.type === 'police' ? 'P' : 'F'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrafficMap;
