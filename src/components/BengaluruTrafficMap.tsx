
import React from 'react';
import { Card } from '@/components/ui/card';
import { Map, MapPin, Info } from 'lucide-react';

const BengaluruTrafficMap = () => {
  // Offline map implementation using static data visualization
  return (
    <Card className="p-0 overflow-hidden">
      <div className="h-[600px] relative bg-gray-50">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-4xl h-full rounded-lg overflow-hidden relative bg-gray-100 shadow-inner">
            {/* Static map visualization */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                {/* Bengaluru outline shape */}
                <path 
                  d="M400,150 C500,150 550,250 550,300 C550,400 480,450 400,450 C320,450 250,400 250,300 C250,250 300,150 400,150 Z" 
                  fill="#e5e7eb" 
                  stroke="#9ca3af" 
                  strokeWidth="2"
                />
                
                {/* Major roads */}
                <path d="M400,150 L400,450" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
                <path d="M250,300 L550,300" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
                <path d="M320,200 L480,200" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
                <path d="M320,400 L480,400" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
                <path d="M300,180 L350,250" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                <path d="M500,180 L450,250" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                <path d="M300,420 L350,350" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                <path d="M500,420 L450,350" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                
                {/* Traffic hotspots */}
                <circle cx="400" cy="300" r="15" fill="#ef4444" opacity="0.8" /> {/* Silk Board */}
                <circle cx="480" cy="200" r="12" fill="#ef4444" opacity="0.8" /> {/* KR Puram */}
                <circle cx="350" cy="250" r="12" fill="#fbbf24" opacity="0.8" /> {/* Outer Ring Road */}
                <circle cx="450" cy="350" r="12" fill="#fbbf24" opacity="0.8" /> {/* Marathahalli */}
                
                {/* Landmarks */}
                <circle cx="400" cy="250" r="8" fill="#4ade80" /> {/* Cubbon Park */}
                <circle cx="380" cy="350" r="8" fill="#4ade80" /> {/* Lalbagh */}
                <circle cx="420" cy="220" r="8" fill="#4ade80" /> {/* Vidhana Soudha */}
                <circle cx="450" cy="280" r="8" fill="#4ade80" /> {/* UB City */}
                <circle cx="320" cy="320" r="8" fill="#4ade80" /> {/* Bangalore Palace */}
              </svg>
            </div>
            
            {/* Overlay with landmark labels */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[245px] left-[390px] transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white/80 px-2 py-1 rounded text-xs">Cubbon Park</div>
              </div>
              <div className="absolute top-[350px] left-[370px] transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white/80 px-2 py-1 rounded text-xs">Lalbagh</div>
              </div>
              <div className="absolute top-[220px] left-[430px] transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white/80 px-2 py-1 rounded text-xs">Vidhana Soudha</div>
              </div>
              
              {/* Traffic hotspot labels */}
              <div className="absolute top-[300px] left-[410px] transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-red-50 border border-red-200 px-2 py-1 rounded text-xs text-red-700">Silk Board</div>
              </div>
              <div className="absolute top-[190px] left-[490px] transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-red-50 border border-red-200 px-2 py-1 rounded text-xs text-red-700">KR Puram</div>
              </div>
            </div>
            
            {/* City center marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
              </div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-sm text-xs font-medium">
                City Center
              </div>
            </div>
          </div>
          
          {/* Compass */}
          <div className="absolute top-4 right-4 bg-white/90 w-10 h-10 rounded-full shadow-md flex items-center justify-center">
            <div className="relative w-6 h-6">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-red-500"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-400"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-1 bg-gray-400"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-1 bg-gray-400"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-200"></div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-[8px] font-bold">N</div>
            </div>
          </div>
        </div>
        
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
        
        {/* Landmarks Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-md shadow-md z-10">
          <div className="text-xs font-medium mb-1">Landmarks</div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-xs">Popular Places</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">City Center</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BengaluruTrafficMap;
