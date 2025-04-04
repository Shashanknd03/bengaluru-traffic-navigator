
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Map, MapPin, AlertTriangle } from 'lucide-react';
import { generateMockTrafficPoints } from '../data/mockTrafficData';

// Bengaluru coordinates
const BENGALURU_CENTER: [number, number] = [77.5946, 12.9716];

// Use a public token for demo purposes
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2txOHoxb2k4MDYxbDJ2bnhpZGloZWprcCJ9.lRLjk3y3u1ZwGBxW_jZ9Lw';

const BengaluruTrafficMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: BENGALURU_CENTER,
        zoom: 11,
        pitch: 0,
        bearing: 0,
      });
      
      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Save map reference
      mapRef.current = map;
      
      // Handle map load events
      map.on('load', () => {
        setMapLoaded(true);
        
        // Try to add some basic markers for Bangalore landmarks
        try {
          addBangaloreLandmarks(map);
        } catch (err) {
          console.error('Error adding landmarks:', err);
        }
      });
      
      map.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Failed to load map properly. Using fallback view.');
      });
    } catch (err) {
      console.error('Failed to initialize map:', err);
      setMapError('Failed to initialize map. Using fallback view.');
    }
    
    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapLoaded(false);
    };
  }, []);
  
  // Add some basic landmarks
  const addBangaloreLandmarks = (map: mapboxgl.Map) => {
    const landmarks = [
      { name: "Cubbon Park", location: [77.5933, 12.9763] },
      { name: "Lalbagh Botanical Garden", location: [77.5855, 12.9507] },
      { name: "Bangalore Palace", location: [77.5921, 12.9983] },
      { name: "Vidhana Soudha", location: [77.5906, 12.9797] },
      { name: "UB City", location: [77.5957, 12.9715] }
    ];
    
    landmarks.forEach(landmark => {
      new mapboxgl.Marker({ color: "#4ade80" })
        .setLngLat(landmark.location as [number, number])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${landmark.name}</h3>`))
        .addTo(map);
    });
  };
  
  // Fallback map component
  const FallbackMap = () => (
    <div className="h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6">
      <Map size={64} className="text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Bangalore Map View</h3>
      <p className="text-gray-500 text-center max-w-md mb-4">
        {mapError || "This is a static representation of Bangalore's city map."}
      </p>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-white p-3 rounded shadow-sm">
          <h4 className="font-medium text-sm mb-1">Key Landmarks</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Cubbon Park
            </li>
            <li className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Lalbagh
            </li>
            <li className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Vidhana Soudha
            </li>
          </ul>
        </div>
        <div className="bg-white p-3 rounded shadow-sm">
          <h4 className="font-medium text-sm mb-1">Traffic Legend</h4>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <Card className="p-0 overflow-hidden">
      <div className="h-[600px] relative bg-gray-100">
        {mapError && (
          <div className="absolute top-0 left-0 right-0 bg-amber-50 border-b border-amber-200 p-2 z-20">
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertTriangle size={16} />
              <span>{mapError}</span>
            </div>
          </div>
        )}
        
        <div ref={mapContainerRef} className="absolute inset-0" />
        
        {/* Show fallback if map fails to load */}
        {mapError && <div className="absolute inset-0 z-10"><FallbackMap /></div>}
        
        {/* Traffic Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded-md shadow-md z-10">
          <div className="text-xs font-medium mb-1">Traffic Legend</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-xs">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-800"></div>
              <span className="text-xs">Severe</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BengaluruTrafficMap;
