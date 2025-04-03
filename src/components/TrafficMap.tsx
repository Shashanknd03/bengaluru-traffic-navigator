
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
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Bengaluru coordinates
const BENGALURU_CENTER = [77.5946, 12.9716];
const BENGALURU_BOUNDS = {
  north: 13.1,
  south: 12.8,
  east: 77.8,
  west: 77.4
};

// Use a public token for demo purposes - in production you would use an environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2txOHoxb2k4MDYxbDJ2bnhpZGloZWprcCJ9.lRLjk3y3u1ZwGBxW_jZ9Lw';

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
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [markersInitialized, setMarkersInitialized] = useState(false);
  
  // Store marker references for cleanup
  const trafficMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const intersectionMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const predictionMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const alertMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const emergencyMarkersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: BENGALURU_CENTER,
      zoom: 11,
      pitch: viewMode === '3d' ? 45 : 0,
      bearing: 0,
      antialias: true
    });
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Save map reference
    mapRef.current = map;
    
    // Set up 3D terrain if using 3D mode
    map.on('load', () => {
      if (viewMode === '3d') {
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        
        map.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });
      }
    });
    
    // Cleanup
    return () => {
      clearAllMarkers();
      map.remove();
      mapRef.current = null;
    };
  }, []);
  
  // Handle view mode change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    
    map.setPitch(viewMode === '3d' ? 45 : 0);
    
    if (viewMode === '3d' && map.getStyle().layers) {
      // Add 3D terrain if not already added
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      }
      
      // Add sky layer if not already added
      if (!map.getLayer('sky')) {
        map.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });
      }
    } else if (viewMode === '2d') {
      // Remove terrain in 2D mode
      map.setTerrain(null);
      
      // Remove sky layer in 2D mode
      if (map.getLayer('sky')) {
        map.removeLayer('sky');
      }
    }
    
    // Refresh all markers
    updateMapMarkers();
  }, [viewMode]);
  
  // Update markers when data or visibility changes
  useEffect(() => {
    updateMapMarkers();
  }, [trafficPoints, intersections, predictions, alerts, emergencyVehicles, 
      showTraffic, showIntersections, showPredictions, showAlerts, showEmergencyVehicles]);
  
  // Clear all markers
  const clearAllMarkers = () => {
    [...trafficMarkersRef.current, 
     ...intersectionMarkersRef.current, 
     ...predictionMarkersRef.current, 
     ...alertMarkersRef.current,
     ...emergencyMarkersRef.current].forEach(marker => marker.remove());
    
    trafficMarkersRef.current = [];
    intersectionMarkersRef.current = [];
    predictionMarkersRef.current = [];
    alertMarkersRef.current = [];
    emergencyMarkersRef.current = [];
  };
  
  // Update all map markers
  const updateMapMarkers = () => {
    if (!mapRef.current || !mapRef.current.loaded()) return;
    
    // Clear existing markers
    clearAllMarkers();
    
    // Add traffic points
    if (showTraffic) {
      trafficMarkersRef.current = trafficPoints.map(point => {
        const el = document.createElement('div');
        el.className = `traffic-marker ${getStatusClass(point.status)}`;
        el.style.width = '10px';
        el.style.height = '10px';
        el.style.borderRadius = '50%';
        
        // Create tooltip
        el.setAttribute('title', `${point.roadName}: ${point.speedKmph} km/h`);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([point.location.lng, point.location.lat])
          .addTo(mapRef.current!);
        
        return marker;
      });
    }
    
    // Add intersections
    if (showIntersections) {
      intersectionMarkersRef.current = intersections.map(intersection => {
        const el = document.createElement('div');
        el.className = `intersection-marker ${getStatusClass(intersection.status)}`;
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.borderRadius = '3px';
        el.style.border = '2px solid white';
        
        // Create tooltip
        el.setAttribute('title', intersection.name);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([intersection.location.lng, intersection.location.lat])
          .addTo(mapRef.current!);
        
        return marker;
      });
    }
    
    // Add predictions
    if (showPredictions) {
      predictionMarkersRef.current = predictions.map(prediction => {
        const el = document.createElement('div');
        el.className = `prediction-marker ${getStatusClass(prediction.predictedStatus)}`;
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.opacity = '0.7';
        el.style.animation = 'pulse 2s infinite';
        
        // Create tooltip
        el.setAttribute('title', `Predicted: ${prediction.predictedStatus} (${prediction.timeFrame})`);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([prediction.location.lng, prediction.location.lat])
          .addTo(mapRef.current!);
        
        return marker;
      });
    }
    
    // Add alerts
    if (showAlerts) {
      alertMarkersRef.current = alerts.map(alert => {
        const el = document.createElement('div');
        el.className = 'alert-marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.transform = 'rotate(45deg)';
        el.style.backgroundColor = '#ffcc00';
        
        // Create tooltip
        el.setAttribute('title', `${alert.type}: ${alert.description}`);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([alert.location.lng, alert.location.lat])
          .addTo(mapRef.current!);
        
        return marker;
      });
    }
    
    // Add emergency vehicles
    if (showEmergencyVehicles) {
      emergencyMarkersRef.current = emergencyVehicles.map(vehicle => {
        const el = document.createElement('div');
        el.className = `emergency-marker ${getEmergencyVehicleClass(vehicle.type)}`;
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.animation = 'pulse 1s infinite';
        
        // Display vehicle type initial
        const textEl = document.createElement('span');
        textEl.innerText = vehicle.type === 'ambulance' ? 'A' : vehicle.type === 'police' ? 'P' : 'F';
        textEl.style.position = 'absolute';
        textEl.style.top = '50%';
        textEl.style.left = '50%';
        textEl.style.transform = 'translate(-50%, -50%)';
        textEl.style.color = 'white';
        textEl.style.fontSize = '10px';
        textEl.style.fontWeight = 'bold';
        el.appendChild(textEl);
        
        // Create tooltip
        el.setAttribute('title', `${vehicle.type} (${vehicle.priority} priority)`);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([vehicle.location.lng, vehicle.location.lat])
          .addTo(mapRef.current!);
        
        return marker;
      });
    }
    
    setMarkersInitialized(true);
  };
  
  // Helper function to get CSS class based on traffic status
  const getStatusClass = (status: 'low' | 'medium' | 'high' | 'severe'): string => {
    switch (status) {
      case 'low': return 'bg-traffic-green';
      case 'medium': return 'bg-traffic-amber';
      case 'high': return 'bg-traffic-red';
      case 'severe': return 'bg-red-800';
      default: return 'bg-gray-400';
    }
  };
  
  // Helper function to get CSS class for emergency vehicle
  const getEmergencyVehicleClass = (type: 'ambulance' | 'police' | 'fire'): string => {
    switch (type) {
      case 'ambulance': return 'bg-red-500';
      case 'police': return 'bg-blue-500';
      case 'fire': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };
  
  // Handle zoom controls
  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };
  
  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };
  
  // Reset view
  const handleResetView = () => {
    mapRef.current?.flyTo({
      center: BENGALURU_CENTER,
      zoom: 11,
      pitch: viewMode === '3d' ? 45 : 0,
      bearing: 0
    });
  };
  
  return (
    <div className="relative bengaluru-map-container bg-traffic-lightGray h-[600px] rounded-lg overflow-hidden">
      {/* Map container */}
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* CSS for markers */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        .traffic-marker, .intersection-marker, .prediction-marker, .emergency-marker, .alert-marker {
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        .bg-traffic-green { background-color: #4ade80; }
        .bg-traffic-amber { background-color: #fbbf24; }
        .bg-traffic-red { background-color: #ef4444; }
      `}</style>
      
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
    </div>
  );
};

export default TrafficMap;
