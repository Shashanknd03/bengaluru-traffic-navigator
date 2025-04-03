
import React, { useEffect, useRef, useState } from 'react';
import { 
  TrafficPoint, 
  Intersection, 
  TrafficPrediction, 
  TrafficAlert,
  EmergencyVehicle 
} from '../types/traffic';
import { Map, Info, Navigation, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

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
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [zoomLevel, setZoomLevel] = useState(12);
  const [rotation, setRotation] = useState(0);
  
  // This would ideally use a real map API like Google Maps, Mapbox, or Leaflet
  // For this prototype, we'll create a visual representation using HTML/CSS/ThreeJS
  
  useEffect(() => {
    if (mapContainerRef.current && !mapInitialized) {
      setMapInitialized(true);
      // In a real implementation, this is where map initialization would happen
      // For 3D visualization, we would initialize Three.js here
      initializeMap();
    }
  }, [mapInitialized]);
  
  // In a real implementation, this would initialize the 3D map
  const initializeMap = () => {
    // This is a placeholder for the actual Three.js initialization
    console.log('Initializing map in', viewMode, 'mode');
    
    // For a real implementation, the following would be done:
    // 1. Load 3D models of the city
    // 2. Setup camera and lighting
    // 3. Create particle systems for traffic visualization
    // 4. Set up event listeners for user interaction
  };
  
  // Handle view mode toggle
  useEffect(() => {
    if (mapInitialized) {
      console.log('Switching to', viewMode, 'view mode');
      // In a real implementation, this would rebuild the map with 2D or 3D rendering
    }
  }, [viewMode, mapInitialized]);
  
  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 8));
  };
  
  // Reset view
  const handleResetView = () => {
    setZoomLevel(12);
    setRotation(0);
  };
  
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
    
    // Calculate percentage within bounds (adjusted for zoom level)
    const centerLat = (northBound + southBound) / 2;
    const centerLng = (eastBound + westBound) / 2;
    
    const latRange = (northBound - southBound) / (zoomLevel / 12);
    const lngRange = (eastBound - westBound) / (zoomLevel / 12);
    
    const adjustedNorth = centerLat + latRange / 2;
    const adjustedSouth = centerLat - latRange / 2;
    const adjustedEast = centerLng + lngRange / 2;
    const adjustedWest = centerLng - lngRange / 2;
    
    const leftPercent = ((lng - adjustedWest) / (adjustedEast - adjustedWest)) * 100;
    const topPercent = ((adjustedNorth - lat) / (adjustedNorth - adjustedSouth)) * 100;
    
    // Apply rotation if in 3D mode
    if (viewMode === '3d' && rotation !== 0) {
      // In a real implementation, we would apply 3D transformations
      // This is a simple placeholder for demonstration
      return {
        left: `${Math.min(100, Math.max(0, leftPercent))}%`,
        top: `${Math.min(100, Math.max(0, topPercent))}%`,
        transform: `rotate(${rotation}deg)`
      };
    }
    
    return {
      left: `${Math.min(100, Math.max(0, leftPercent))}%`,
      top: `${Math.min(100, Math.max(0, topPercent))}%`
    };
  };

  // Generate 3D effect styles based on traffic status
  const get3DStyles = (status: 'low' | 'medium' | 'high' | 'severe') => {
    if (viewMode !== '3d') return {};
    
    // In a real implementation, this would apply proper 3D effects
    // For demonstration, we'll just apply simple CSS transforms
    
    const baseHeight = status === 'low' ? 2 : 
                      status === 'medium' ? 4 : 
                      status === 'high' ? 7 : 10;
                      
    return {
      boxShadow: `0 0 10px rgba(0,0,0,0.3)`,
      height: `${baseHeight}px`,
      marginTop: `-${baseHeight}px`,
      transform: `translateZ(${baseHeight}px)`
    };
  };

  return (
    <div className="relative bengaluru-map-container bg-traffic-lightGray h-[600px] rounded-lg overflow-hidden">
      <div 
        className={`absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.5946,12.9716,11,0/1000x600?access_token=pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2txOHoxb2k4MDYxbDJ2bnhpZGloZWprcCJ9.lRLjk3y3u1ZwGBxW_jZ9Lw')] bg-cover bg-center transition-all duration-300 ${viewMode === '3d' ? 'opacity-60' : 'opacity-80'}`} 
        style={{ transform: `scale(${zoomLevel / 10})` }}
      >
        {/* This would be replaced with an actual map in a real implementation */}
      </div>
      
      <div ref={mapContainerRef} className="absolute inset-0 pointer-events-none">
        {/* This div would contain the actual 3D visualization in a real implementation */}
        {viewMode === '3d' && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20 z-[1]"></div>
        )}
      </div>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md z-10 space-y-2">
        <div className="flex justify-between items-center mb-2 border-b pb-2">
          <span className="text-xs font-medium">Map Controls</span>
          <Toggle 
            pressed={viewMode === '3d'} 
            onPressedChange={(pressed) => setViewMode(pressed ? '3d' : '2d')}
            size="sm"
            variant="outline"
            className="h-6 data-[state=on]:bg-blue-50"
          >
            <span className="text-xs">3D</span>
          </Toggle>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="flex gap-2 items-center h-7" onClick={handleZoomIn}>
            <ZoomIn size={14} />
            <span className="text-xs">Zoom In</span>
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2 items-center h-7" onClick={handleZoomOut}>
            <ZoomOut size={14} />
            <span className="text-xs">Zoom Out</span>
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2 items-center h-7" onClick={handleResetView}>
            <RotateCcw size={14} />
            <span className="text-xs">Reset View</span>
          </Button>
          <Button variant="outline" size="sm" className="flex gap-2 items-center h-7">
            <Layers size={14} />
            <span className="text-xs">Layers</span>
          </Button>
        </div>
      </div>
      
      {/* Traffic legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded-md shadow-md z-10">
        <div className="text-xs font-medium mb-1">Traffic Legend</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-traffic-green"></div>
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-traffic-amber"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-traffic-red"></div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-800"></div>
            <span className="text-xs">Severe</span>
          </div>
        </div>
      </div>
      
      {/* Traffic points */}
      {showTraffic && trafficPoints.map(point => (
        <div 
          key={point.id}
          className={`absolute ${viewMode === '3d' ? 'w-3 h-3' : 'w-2.5 h-2.5'} rounded-full ${getStatusColor(point.status)} transition-all duration-300`}
          style={{
            ...getPositionStyle(point.location.lat, point.location.lng),
            ...get3DStyles(point.status),
            zIndex: viewMode === '3d' ? Math.floor(point.speedKmph) : 2
          }}
          title={`${point.roadName}: ${point.speedKmph} km/h`}
        />
      ))}
      
      {/* Intersections */}
      {showIntersections && intersections.map(intersection => (
        <div 
          key={intersection.id}
          className={`absolute ${viewMode === '3d' ? 'w-5 h-5' : 'w-4 h-4'} rounded-sm border-2 border-white ${getStatusColor(intersection.status)} transition-all duration-300`}
          style={{
            ...getPositionStyle(intersection.location.lat, intersection.location.lng),
            ...get3DStyles(intersection.status),
            zIndex: viewMode === '3d' ? 5 : 3
          }}
          title={`${intersection.name}`}
        />
      ))}
      
      {/* Predictions */}
      {showPredictions && predictions.map(prediction => (
        <div 
          key={prediction.id}
          className={`absolute ${viewMode === '3d' ? 'w-5 h-5' : 'w-4 h-4'} rounded-full border border-white ${getStatusColor(prediction.predictedStatus)} animate-pulse-slow transition-all duration-300`}
          style={{
            ...getPositionStyle(prediction.location.lat, prediction.location.lng),
            zIndex: 4
          }}
          title={`Predicted: ${prediction.predictedStatus} (${prediction.timeFrame})`}
        >
          <div className="absolute inset-0 rounded-full border-2 border-white" />
        </div>
      ))}
      
      {/* Alerts */}
      {showAlerts && alerts.map(alert => (
        <div 
          key={alert.id}
          className={`absolute ${viewMode === '3d' ? 'w-7 h-7' : 'w-6 h-6'} flex items-center justify-center transition-all duration-300`}
          style={{
            ...getPositionStyle(alert.location.lat, alert.location.lng),
            zIndex: 10
          }}
          title={`${alert.type}: ${alert.description}`}
        >
          <div className={`w-full h-full bg-yellow-400 rotate-45 animate-pulse-slow ${viewMode === '3d' ? 'shadow-lg' : ''}`}>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-600">!</div>
          </div>
        </div>
      ))}
      
      {/* Emergency Vehicles */}
      {showEmergencyVehicles && emergencyVehicles.map(vehicle => (
        <div 
          key={vehicle.id}
          className={`absolute ${viewMode === '3d' ? 'w-5 h-5' : 'w-4 h-4'} ${getEmergencyVehicleColor(vehicle.type)} rounded-full animate-pulse-slow border border-white transition-all duration-300`}
          style={{
            ...getPositionStyle(vehicle.location.lat, vehicle.location.lng),
            zIndex: 11
          }}
          title={`${vehicle.type} (${vehicle.priority} priority)`}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
            {vehicle.type === 'ambulance' ? 'A' : vehicle.type === 'police' ? 'P' : 'F'}
          </div>
        </div>
      ))}
      
      {/* 3D buildings layer (only shown in 3D mode) */}
      {viewMode === '3d' && (
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {/* In a real implementation, this would contain actual 3D buildings */}
          {/* For demonstration, we'll just show a few sample buildings */}
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={`building-${i}`}
              className="absolute bg-gray-300/70 border border-gray-400"
              style={{
                width: `${20 + Math.random() * 30}px`,
                height: `${20 + Math.random() * 30}px`,
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                transform: `translateZ(${10 + Math.random() * 20}px) rotateX(60deg)`,
                boxShadow: '0 0 10px rgba(0,0,0,0.2)'
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrafficMap;
