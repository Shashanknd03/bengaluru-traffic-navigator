
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { generateMockTrafficPoints } from '../data/mockTrafficData';

// Bengaluru coordinates
const BENGALURU_CENTER: [number, number] = [77.5946, 12.9716];
const BENGALURU_BOUNDS = {
  north: 13.1,
  south: 12.8,
  east: 77.8,
  west: 77.4
};

// Use a public token for demo purposes
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2txOHoxb2k4MDYxbDJ2bnhpZGloZWprcCJ9.lRLjk3y3u1ZwGBxW_jZ9Lw';

const BengaluruTrafficMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);
  
  // Generate traffic data
  const trafficPoints = generateMockTrafficPoints(100);
  
  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: BENGALURU_CENTER,
      zoom: 11,
      pitch: 0,
      bearing: 0,
      bounds: [
        [BENGALURU_BOUNDS.west, BENGALURU_BOUNDS.south], 
        [BENGALURU_BOUNDS.east, BENGALURU_BOUNDS.north]
      ],
      fitBoundsOptions: { padding: 40 }
    });
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Save map reference
    mapRef.current = map;
    
    // Listen for style load event
    map.on('style.load', () => {
      console.log('Map style loaded');
      setStyleLoaded(true);
      
      // Add traffic data to the map after style is loaded
      addTrafficData(map, trafficPoints);
    });
    
    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
      setStyleLoaded(false);
    };
  }, []);
  
  // Add traffic data to the map
  const addTrafficData = (map: mapboxgl.Map, points: any[]) => {
    // Add source for traffic points
    map.addSource('traffic-points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: points.map(point => ({
          type: 'Feature',
          properties: {
            status: point.status,
            roadName: point.roadName,
            speedKmph: point.speedKmph
          },
          geometry: {
            type: 'Point',
            coordinates: [point.location.lng, point.location.lat]
          }
        }))
      }
    });
    
    // Add traffic points layer
    map.addLayer({
      id: 'traffic-points',
      type: 'circle',
      source: 'traffic-points',
      paint: {
        'circle-radius': 5,
        'circle-color': [
          'match',
          ['get', 'status'],
          'low', '#4ade80',    // green
          'medium', '#fbbf24', // amber
          'high', '#ef4444',   // red
          'severe', '#991b1b', // dark red
          '#888888'            // default gray
        ],
        'circle-opacity': 0.8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      }
    });
    
    // Add road congestion layer
    addCongestionLayer(map, points);
    
    // Add popup on hover
    map.on('mouseenter', 'traffic-points', (e) => {
      if (e.features && e.features.length > 0) {
        const coordinates = (e.features[0].geometry as any).coordinates.slice();
        const properties = e.features[0].properties;
        
        const popup = new mapboxgl.Popup({
          closeButton: false,
          className: 'traffic-popup'
        })
          .setLngLat(coordinates)
          .setHTML(`
            <div>
              <h4 class="font-semibold">${properties.roadName}</h4>
              <p>Status: <span class="capitalize">${properties.status}</span></p>
              <p>Speed: ${properties.speedKmph} km/h</p>
            </div>
          `)
          .addTo(map);
        
        map.getCanvas().style.cursor = 'pointer';
      }
    });
    
    map.on('mouseleave', 'traffic-points', () => {
      map.getCanvas().style.cursor = '';
      const popups = document.getElementsByClassName('traffic-popup');
      if (popups[0]) (popups[0] as any).remove();
    });
  };
  
  // Add congestion layer using line strings connecting nearby points
  const addCongestionLayer = (map: mapboxgl.Map, points: any[]) => {
    // Create road segments based on points and their status
    const roadSegments = {
      type: 'FeatureCollection',
      features: []
    };
    
    // Create segments between nearby points with similar status
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const p1 = points[i];
        const p2 = points[j];
        
        // Calculate distance
        const dx = p1.location.lng - p2.location.lng;
        const dy = p1.location.lat - p2.location.lat;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Connect if they're within a threshold and on the same road
        if (distance < 0.01 && p1.roadName === p2.roadName) {
          roadSegments.features.push({
            type: 'Feature',
            properties: {
              status: p1.status,
              roadName: p1.roadName
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [p1.location.lng, p1.location.lat],
                [p2.location.lng, p2.location.lat]
              ]
            }
          });
        }
      }
    }
    
    // Add source for road congestion
    map.addSource('road-congestion', {
      type: 'geojson',
      data: roadSegments as any
    });
    
    // Add road congestion layer
    map.addLayer({
      id: 'road-congestion',
      type: 'line',
      source: 'road-congestion',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-width': 4,
        'line-color': [
          'match',
          ['get', 'status'],
          'low', '#4ade80',    // green
          'medium', '#fbbf24', // amber
          'high', '#ef4444',   // red
          'severe', '#991b1b', // dark red
          '#888888'            // default gray
        ],
        'line-opacity': 0.7
      }
    });
  };
  
  return (
    <Card className="p-0 overflow-hidden">
      <div className="h-[600px] relative bg-gray-100">
        <div ref={mapContainerRef} className="absolute inset-0" />
        
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
