
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Map, Activity, MapPin, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Traffic Management Dashboard</h1>
          <p className="text-gray-600 max-w-3xl">
            Welcome to the Bengaluru Traffic Management System. This dashboard provides offline traffic visualization 
            and analysis tools to help understand traffic patterns across the city.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Map className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Traffic Map</h3>
                  <p className="text-sm text-gray-500">View traffic conditions across Bengaluru</p>
                </div>
              </div>
              <Link 
                to="/bengaluru-map" 
                className="block w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 text-center rounded-md transition-colors text-sm font-medium"
              >
                View Map
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <Activity className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Traffic Analytics</h3>
                  <p className="text-sm text-gray-500">Traffic statistics and patterns</p>
                </div>
              </div>
              <button 
                className="block w-full py-2 px-4 bg-gray-100 text-gray-500 text-center rounded-md cursor-not-allowed text-sm font-medium"
              >
                Coming Soon
              </button>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Future Predictions</h3>
                  <p className="text-sm text-gray-500">Predicted traffic conditions</p>
                </div>
              </div>
              <button 
                className="block w-full py-2 px-4 bg-gray-100 text-gray-500 text-center rounded-md cursor-not-allowed text-sm font-medium"
              >
                Coming Soon
              </button>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Bengaluru Traffic Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium">Major Traffic Corridors</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-500" />
                  <span>Outer Ring Road (ORR)</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-500" />
                  <span>Hosur Road</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-500" />
                  <span>Bannerghatta Road</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-500" />
                  <span>Old Madras Road</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium">Known Congestion Points</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Silk Board Junction</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>KR Puram Bridge</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span>Hebbal Flyover</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span>Marathahalli Bridge</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium">Peak Hours</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">Morning Rush</p>
                  <p className="text-gray-600">8:00 AM - 10:30 AM</p>
                </div>
                <div>
                  <p className="font-medium">Evening Rush</p>
                  <p className="text-gray-600">5:00 PM - 8:30 PM</p>
                </div>
                <div>
                  <p className="font-medium">Weekend Activity</p>
                  <p className="text-gray-600">11:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Bengaluru Traffic Management System | Offline Demo Version</p>
          <p className="text-xs mt-1">This is a static demo system with simulated traffic data.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
