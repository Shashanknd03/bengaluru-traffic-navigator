
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleMapTraffic from '@/components/GoogleMapTraffic';
import BengaluruTrafficMap from '@/components/BengaluruTrafficMap';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const BengaluruMap = () => {
  const [mapType, setMapType] = useState<'google' | 'offline'>('offline');
  const { toast } = useToast();

  const toggleMapType = () => {
    setMapType(prev => prev === 'offline' ? 'google' : 'offline');
    toast({
      title: `Switched to ${mapType === 'offline' ? 'Google Maps' : 'Offline Map'}`,
      description: mapType === 'offline' 
        ? 'Now showing real-time traffic data via Google Maps API.' 
        : 'Now showing offline visualization of traffic data.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bengaluru Traffic Map</h1>
            <p className="text-gray-600">
              {mapType === 'offline' 
                ? 'Offline visualization of traffic conditions across Bengaluru.' 
                : 'Real-time traffic visualization powered by Google Maps API.'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 p-2 rounded">
              <Info size={16} />
              <span>Population: ~12 million | Area: 741 km²</span>
            </div>
            <Button onClick={toggleMapType} variant="outline" size="sm">
              Switch to {mapType === 'offline' ? 'Google Maps' : 'Offline Map'}
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <span className="text-green-600 font-medium">68</span>
                </div>
                <p className="text-sm text-gray-600">Low Traffic Areas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                  <span className="text-amber-600 font-medium">42</span>
                </div>
                <p className="text-sm text-gray-600">Medium Traffic Areas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <span className="text-red-600 font-medium">24</span>
                </div>
                <p className="text-sm text-gray-600">Heavy Traffic Areas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <span className="text-purple-600 font-medium">12</span>
                </div>
                <p className="text-sm text-gray-600">Road Closures</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {mapType === 'offline' ? <BengaluruTrafficMap /> : <GoogleMapTraffic />}
        
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">About Bengaluru</h3>
              <p className="text-sm text-gray-600 mb-3">
                Bengaluru (formerly Bangalore) is the capital of Karnataka state in southern India. 
                Known as the "Silicon Valley of India," it's a major IT hub with a pleasant climate.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Key Areas</p>
                    <p className="text-xs text-gray-500">MG Road, Koramangala, Indiranagar, Whitefield, Electronic City</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Traffic Hotspots</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                  <span>Silk Board Junction - Consistently heavy traffic during peak hours</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                  <span>KR Puram Tin Factory - Major bottleneck area</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0"></div>
                  <span>Outer Ring Road - Moderate to heavy traffic throughout the day</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0"></div>
                  <span>Marathahalli Bridge - Congestion during evenings</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 Bengaluru Traffic Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default BengaluruMap;
