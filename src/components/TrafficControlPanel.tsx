
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw, Layers, Map, Navigation, AlertTriangle, Ambulance } from "lucide-react";

interface TrafficControlPanelProps {
  showTraffic: boolean;
  setShowTraffic: (show: boolean) => void;
  showIntersections: boolean;
  setShowIntersections: (show: boolean) => void;
  showPredictions: boolean;
  setShowPredictions: (show: boolean) => void;
  showAlerts: boolean;
  setShowAlerts: (show: boolean) => void;
  showEmergencyVehicles: boolean;
  setShowEmergencyVehicles: (show: boolean) => void;
  refreshData: () => void;
  useRealTimeData?: boolean;
  toggleRealTimeData?: () => void;
}

const TrafficControlPanel: React.FC<TrafficControlPanelProps> = ({ 
  showTraffic, 
  setShowTraffic, 
  showIntersections, 
  setShowIntersections, 
  showPredictions, 
  setShowPredictions, 
  showAlerts, 
  setShowAlerts, 
  showEmergencyVehicles,
  setShowEmergencyVehicles,
  refreshData,
  useRealTimeData = false,
  toggleRealTimeData
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center justify-between">
          <span>Map Controls</span>
          <Button variant="ghost" size="sm" onClick={refreshData} className="h-7 w-7 p-0">
            <RefreshCw size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {toggleRealTimeData && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation size={18} />
              <Label htmlFor="real-time-data" className="text-sm">Live Traffic Data</Label>
            </div>
            <Switch 
              id="real-time-data" 
              checked={useRealTimeData} 
              onCheckedChange={toggleRealTimeData} 
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map size={18} />
            <Label htmlFor="traffic-toggle" className="text-sm">Traffic Conditions</Label>
          </div>
          <Switch 
            id="traffic-toggle" 
            checked={showTraffic} 
            onCheckedChange={setShowTraffic} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} />
            <Label htmlFor="intersections-toggle" className="text-sm">Intersections</Label>
          </div>
          <Switch 
            id="intersections-toggle" 
            checked={showIntersections} 
            onCheckedChange={setShowIntersections} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map size={18} className="text-purple-500" />
            <Label htmlFor="predictions-toggle" className="text-sm">Traffic Predictions</Label>
          </div>
          <Switch 
            id="predictions-toggle" 
            checked={showPredictions} 
            onCheckedChange={setShowPredictions} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <Label htmlFor="alerts-toggle" className="text-sm">Traffic Alerts</Label>
          </div>
          <Switch 
            id="alerts-toggle" 
            checked={showAlerts} 
            onCheckedChange={setShowAlerts} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ambulance size={18} className="text-red-500" />
            <Label htmlFor="emergency-toggle" className="text-sm">Emergency Vehicles</Label>
          </div>
          <Switch 
            id="emergency-toggle" 
            checked={showEmergencyVehicles} 
            onCheckedChange={setShowEmergencyVehicles} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficControlPanel;
