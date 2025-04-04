
import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, TrafficLayer, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Plus, Minus, RotateCcw, Map } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Bengaluru center coordinates
const BENGALURU_CENTER = {
  lat: 12.9716,
  lng: 77.5946
};

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.5rem'
};

// Using a placeholder API key - this should be replaced with an actual key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

interface MarkerInfo {
  id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  info: string;
  traffic: 'low' | 'medium' | 'high' | 'severe';
}

const GoogleMapTraffic: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerInfo[]>([
    {
      id: '1',
      position: { lat: 12.9716, lng: 77.5946 },
      title: 'Bengaluru City Center',
      info: 'Moderate traffic conditions around city center.',
      traffic: 'medium'
    },
    {
      id: '2',
      position: { lat: 12.9352, lng: 77.6245 },
      title: 'Koramangala',
      info: 'Heavy traffic during evening hours.',
      traffic: 'high'
    },
    {
      id: '3',
      position: { lat: 12.9592, lng: 77.6974 },
      title: 'Whitefield',
      info: 'Construction causing delays.',
      traffic: 'severe'
    }
  ]);
  
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [isTrafficVisible, setIsTrafficVisible] = useState(true);
  const { toast } = useToast();

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  // Helper to get marker icon based on traffic level
  const getMarkerIcon = (traffic: 'low' | 'medium' | 'high' | 'severe') => {
    const colors = {
      low: 'green',
      medium: 'orange',
      high: 'red',
      severe: 'purple'
    };
    
    return {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
      fillColor: colors[traffic],
      fillOpacity: 0.9,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      scale: 1.5
    };
  };

  // Handle search for location
  const handleSearch = () => {
    if (!locationInput || !mapRef) return;
    
    // In a real app, we would use the Places API to geocode the address
    // For this demo, just show a toast and manually add a marker
    toast({
      title: "Searching for location",
      description: `Finding "${locationInput}" on the map...`
    });
    
    // Simulate finding a location
    setTimeout(() => {
      // Add a new marker at a slightly offset position from center
      const newMarker: MarkerInfo = {
        id: Date.now().toString(),
        position: { 
          lat: BENGALURU_CENTER.lat + (Math.random() * 0.03 - 0.015),
          lng: BENGALURU_CENTER.lng + (Math.random() * 0.03 - 0.015)
        },
        title: locationInput,
        info: `Location added based on search: ${locationInput}`,
        traffic: ['low', 'medium', 'high', 'severe'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'severe'
      };
      
      setMarkers(prev => [...prev, newMarker]);
      
      // Center map on new marker
      mapRef.panTo(newMarker.position);
      mapRef.setZoom(14);
      
      // Select the marker to show info window
      setSelectedMarker(newMarker);
      
      toast({
        title: "Location found",
        description: `Added marker for "${locationInput}"`
      });
      
      // Clear input
      setLocationInput('');
    }, 1500);
  };

  // Toggle traffic layer
  const toggleTraffic = () => {
    setIsTrafficVisible(prev => !prev);
  };

  // Reset map view
  const resetView = () => {
    if (!mapRef) return;
    mapRef.panTo(BENGALURU_CENTER);
    mapRef.setZoom(12);
    setSelectedMarker(null);
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (!mapRef) return;
    mapRef.setZoom(mapRef.getZoom()! + 1);
  };
  
  const handleZoomOut = () => {
    if (!mapRef) return;
    mapRef.setZoom(mapRef.getZoom()! - 1);
  };

  if (loadError) {
    return (
      <Card className="p-6 text-center bg-red-50">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Google Maps</h3>
        <p className="text-red-600">
          {loadError.message || "Failed to load Google Maps. Please check your API key and try again."}
        </p>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="p-6 text-center">
        <div className="animate-pulse">
          <h3 className="text-lg font-medium mb-2">Loading Google Maps...</h3>
          <div className="h-[600px] bg-gray-200 rounded-lg"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Search for a location in Bengaluru"
          className="flex-grow"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>
          <MapPin className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      
      <div className="relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={BENGALURU_CENTER}
          zoom={12}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {/* Traffic Layer */}
          {isTrafficVisible && <TrafficLayer />}
          
          {/* Custom Markers */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.title}
              icon={getMarkerIcon(marker.traffic)}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}
          
          {/* Info Window */}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2 max-w-[200px]">
                <h3 className="font-medium text-gray-900">{selectedMarker.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedMarker.info}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs mr-2">Traffic:</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    selectedMarker.traffic === 'low' ? 'bg-green-100 text-green-800' :
                    selectedMarker.traffic === 'medium' ? 'bg-amber-100 text-amber-800' :
                    selectedMarker.traffic === 'high' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedMarker.traffic.charAt(0).toUpperCase() + selectedMarker.traffic.slice(1)}
                  </span>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-white/90" onClick={handleZoomIn}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-white/90" onClick={handleZoomOut}>
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-white/90" onClick={resetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`h-8 w-8 p-0 ${isTrafficVisible ? 'bg-blue-50 border-blue-200' : 'bg-white/90'}`}
            onClick={toggleTraffic}
          >
            <Map className={`h-4 w-4 ${isTrafficVisible ? 'text-blue-600' : ''}`} />
          </Button>
        </div>
        
        {/* Traffic Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded shadow-sm border">
          <div className="text-xs font-medium mb-1">Traffic Legend</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs">Severe</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Total Traffic Points</h3>
              <p className="text-2xl font-bold">{markers.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Map className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium">Traffic Layer</h3>
              <p className="text-lg font-medium">{isTrafficVisible ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Map className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Map Status</h3>
              <p className="text-lg font-medium">Real-time</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GoogleMapTraffic;
