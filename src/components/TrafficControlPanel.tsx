
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Map, 
  Layers, 
  AlertCircle, 
  CarFront,
  Ambulance,
  SquareAsterisk,
  RotateCcw
} from 'lucide-react';

interface TrafficControlPanelProps {
  showTraffic: boolean;
  setShowTraffic: (value: boolean) => void;
  showIntersections: boolean;
  setShowIntersections: (value: boolean) => void;
  showPredictions: boolean;
  setShowPredictions: (value: boolean) => void;
  showAlerts: boolean;
  setShowAlerts: (value: boolean) => void;
  showEmergencyVehicles: boolean;
  setShowEmergencyVehicles: (value: boolean) => void;
  refreshData: () => void;
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
  refreshData
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Control Panel
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1"
            onClick={refreshData}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="layers">
          <TabsList className="grid grid-cols-2 mx-6">
            <TabsTrigger value="layers">Map Layers</TabsTrigger>
            <TabsTrigger value="controls">Traffic Controls</TabsTrigger>
          </TabsList>
          <TabsContent value="layers" className="px-6 pb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CarFront className="h-4 w-4 text-traffic-blue" />
                  <Label htmlFor="show-traffic" className="text-sm">
                    Current Traffic
                  </Label>
                </div>
                <Switch 
                  id="show-traffic" 
                  checked={showTraffic} 
                  onCheckedChange={setShowTraffic} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SquareAsterisk className="h-4 w-4 text-traffic-blue" />
                  <Label htmlFor="show-intersections" className="text-sm">
                    Intersections
                  </Label>
                </div>
                <Switch 
                  id="show-intersections" 
                  checked={showIntersections} 
                  onCheckedChange={setShowIntersections} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-traffic-lightBlue" />
                  <Label htmlFor="show-predictions" className="text-sm">
                    Predictions
                  </Label>
                </div>
                <Switch 
                  id="show-predictions" 
                  checked={showPredictions} 
                  onCheckedChange={setShowPredictions} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-traffic-amber" />
                  <Label htmlFor="show-alerts" className="text-sm">
                    Alerts
                  </Label>
                </div>
                <Switch 
                  id="show-alerts" 
                  checked={showAlerts} 
                  onCheckedChange={setShowAlerts} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ambulance className="h-4 w-4 text-traffic-red" />
                  <Label htmlFor="show-emergency" className="text-sm">
                    Emergency Vehicles
                  </Label>
                </div>
                <Switch 
                  id="show-emergency" 
                  checked={showEmergencyVehicles} 
                  onCheckedChange={setShowEmergencyVehicles} 
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="controls" className="px-6 pb-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-2">
                Traffic management controls for authorized personnel
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  Override Signals
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  Emergency Mode
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  Reroute Traffic
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  Deploy Personnel
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                * Please note: These controls require authorization and will affect real-world 
                traffic management systems. Use with caution.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrafficControlPanel;
