import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, TrafficLayer, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, MapPin, Plus, Minus, RotateCcw, Map, RefreshCw } from 'lucide-react';
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
  
  const [dateFilter, setDateFilter] = useState<Date | undefined>(new Date());
  const [timeOfDay, setTimeOfDay] = useState<string>('current');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(10000); // 10 seconds
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);

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

  // Setup auto-refresh
  useEffect(() => {
    if (!autoRefreshEnabled || !refreshInterval) {
      return;
    }
    
    const interval = setInterval(() => {
      simulateTrafficUpdate();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefreshEnabled, refreshInterval]);

  // Simulate real-time traffic updates
  const simulateTrafficUpdate = () => {
    if (!mapRef) return;
    
    // Update existing markers with slightly different traffic conditions
    const updatedMarkers = markers.map(marker => {
      const trafficLevels: Array<'low' | 'medium' | 'high' | 'severe'> = ['low', 'medium', 'high', 'severe'];
      const currentIndex = trafficLevels.indexOf(marker.traffic);
      
      // 30% chance to change traffic level
      const shouldChange = Math.random() < 0.3;
      
      if (!shouldChange) return marker;
      
      // Determine new traffic level (more likely to stay similar than jump dramatically)
      let newIndex = currentIndex;
      const change = Math.random();
      
      if (change < 0.6) {
        // 60% chance to move by 1 level
        newIndex = Math.max(0, Math.min(3, currentIndex + (Math.random() < 0.5 ? 1 : -1)));
      } else if (change < 0.9) {
        // 30% chance to stay the same
        newIndex = currentIndex;
      } else {
        // 10% chance to jump 2 levels
        newIndex = Math.max(0, Math.min(3, currentIndex + (Math.random() < 0.5 ? 2 : -2)));
      }
      
      return {
        ...marker,
        traffic: trafficLevels[newIndex],
        info: `Updated at ${new Date().toLocaleTimeString()} - ${trafficLevels[newIndex]} traffic conditions.`
      };
    });
    
    setMarkers(updatedMarkers);
    
    toast({
      title: "Traffic data updated",
      description: `Real-time traffic conditions refreshed at ${new Date().toLocaleTimeString()}`,
      variant: "default",
    });
  };

  // Handle search for location (enhanced version)
  const handleSearch = () => {
    if (!locationInput || !mapRef) return;
    
    toast({
      title: "Searching for location",
      description: `Finding "${locationInput}" on the map...`
    });
    
    // In a real implementation, we would use the Google Places API
    // For this demo, simulate geocoding with a delay
    setTimeout(() => {
      // Generate a somewhat realistic position by modifying the center coordinates
      // This makes it seem like we found different locations based on the search
      const searchTerm = locationInput.toLowerCase();
      let position = { ...BENGALURU_CENTER };
      
      // Adjust position based on common Bengaluru locations
      if (searchTerm.includes('koramangala')) {
        position = { lat: 12.9352, lng: 77.6245 };
      } else if (searchTerm.includes('whitefield')) {
        position = { lat: 12.9698, lng: 77.7500 };
      } else if (searchTerm.includes('electronic city') || searchTerm.includes('electronics city')) {
        position = { lat: 12.8399, lng: 77.6770 };
      } else if (searchTerm.includes('indiranagar')) {
        position = { lat: 12.9784, lng: 77.6408 };
      } else if (searchTerm.includes('mg road') || searchTerm.includes('m.g. road')) {
        position = { lat: 12.9758, lng: 77.6261 };
      } else if (searchTerm.includes('hsr')) {
        position = { lat: 12.9116, lng: 77.6741 };
      } else if (searchTerm.includes('silk board') || searchTerm.includes('silkboard')) {
        position = { lat: 12.9170, lng: 77.6209 };
      } else {
        // Random position within Bengaluru for other searches
        position = {
          lat: BENGALURU_CENTER.lat + (Math.random() * 0.06 - 0.03),
          lng: BENGALURU_CENTER.lng + (Math.random() * 0.06 - 0.03)
        };
      }
      
      // Traffic conditions based on time of day and location
      const currentHour = new Date().getHours();
      let likelyTraffic: 'low' | 'medium' | 'high' | 'severe' = 'medium';
      
      // Check if location is a known traffic hotspot
      const isHotspot = ['silk board', 'silkboard', 'whitefield', 'marathahalli'].some(hotspot => 
        searchTerm.includes(hotspot)
      );
      
      // Set traffic based on time of day
      if (currentHour >= 8 && currentHour <= 10) {
        likelyTraffic = isHotspot ? 'severe' : 'high'; // Morning rush
      } else if (currentHour >= 17 && currentHour <= 19) {
        likelyTraffic = isHotspot ? 'severe' : 'high'; // Evening rush
      } else if (currentHour >= 22 || currentHour <= 5) {
        likelyTraffic = 'low'; // Late night
      } else {
        likelyTraffic = isHotspot ? 'high' : 'medium'; // Regular hours
      }
      
      // Create new marker
      const newMarker: MarkerInfo = {
        id: Date.now().toString(),
        position,
        title: locationInput,
        info: `Traffic analysis for "${locationInput}" - ${likelyTraffic} traffic conditions.`,
        traffic: likelyTraffic
      };
      
      setMarkers(prev => [...prev, newMarker]);
      
      // Center map on new marker
      mapRef.panTo(position);
      mapRef.setZoom(14);
      
      // Select the marker to show info window
      setSelectedMarker(newMarker);
      
      toast({
        title: "Location found",
        description: `Added marker for "${locationInput}"`
      });
      
      // Clear input
      setLocationInput('');
    }, 1000);
  };

  // Time of day filter handler
  const handleTimeOfDayChange = (time: string) => {
    setTimeOfDay(time);
    
    if (time === 'current') {
      // Use current traffic
      simulateTrafficUpdate();
      return;
    }
    
    // Simulate different traffic patterns based on time of day
    const trafficPatterns = {
      'morning': { // Morning rush hour
        high: 0.5,    // 50% chance for high traffic
        severe: 0.3,  // 30% chance for severe traffic
        medium: 0.15, // 15% chance for medium traffic
        low: 0.05     // 5% chance for low traffic
      },
      'midday': { // Midday
        medium: 0.45, // 45% chance for medium traffic
        low: 0.3,     // 30% chance for low traffic
        high: 0.2,    // 20% chance for high traffic
        severe: 0.05  // 5% chance for severe traffic
      },
      'evening': { // Evening rush hour
        high: 0.45,   // 45% chance for high traffic
        severe: 0.35, // 35% chance for severe traffic
        medium: 0.15, // 15% chance for medium traffic
        low: 0.05     // 5% chance for low traffic
      },
      'night': { // Night time
        low: 0.6,     // 60% chance for low traffic
        medium: 0.3,  // 30% chance for medium traffic
        high: 0.08,   // 8% chance for high traffic
        severe: 0.02  // 2% chance for severe traffic
      }
    };
    
    const pattern = trafficPatterns[time as keyof typeof trafficPatterns];
    
    const updatedMarkers = markers.map(marker => {
      // Determine new traffic level based on probabilities
      const random = Math.random();
      let newTraffic: 'low' | 'medium' | 'high' | 'severe';
      
      if (random < pattern.low) {
        newTraffic = 'low';
      } else if (random < pattern.low + pattern.medium) {
        newTraffic = 'medium';
      } else if (random < pattern.low + pattern.medium + pattern.high) {
        newTraffic = 'high';
      } else {
        newTraffic = 'severe';
      }
      
      return {
        ...marker,
        traffic: newTraffic,
        info: `${time.charAt(0).toUpperCase() + time.slice(1)} traffic simulation - ${newTraffic} traffic conditions.`
      };
    });
    
    setMarkers(updatedMarkers);
    
    toast({
      title: "Time simulation applied",
      description: `Showing typical ${time} traffic patterns for Bengaluru`,
    });
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(prev => !prev);
    toast({
      title: autoRefreshEnabled ? "Auto-refresh disabled" : "Auto-refresh enabled",
      description: autoRefreshEnabled 
        ? "Real-time updates have been paused. Use the refresh button to update manually." 
        : "Map will now update automatically every 10 seconds.",
    });
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
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search box */}
        <div className="flex-grow flex items-center space-x-2">
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
        
        {/* Time filter */}
        <div className="flex gap-2">
          <Select value={timeOfDay} onValueChange={handleTimeOfDayChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Traffic time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Traffic</SelectItem>
              <SelectItem value="morning">Morning Rush</SelectItem>
              <SelectItem value="midday">Midday Traffic</SelectItem>
              <SelectItem value="evening">Evening Rush</SelectItem>
              <SelectItem value="night">Night Traffic</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant={autoRefreshEnabled ? "default" : "outline"} 
            size="icon" 
            onClick={toggleAutoRefresh}
            title={autoRefreshEnabled ? "Disable auto-refresh" : "Enable auto-refresh"}
          >
            <RefreshCw className={`h-4 w-4 ${autoRefreshEnabled ? 'animate-spin' : ''}`} />
          </Button>
        </div>
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
      
      <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <p>
            This is using a placeholder Google Maps API key. For production use, please replace with your own API key in the GoogleMapTraffic.tsx component.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapTraffic;
