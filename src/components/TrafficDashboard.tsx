
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrafficMap from './TrafficMap';
import TrafficStatsSummary from './TrafficStatsSummary';
import TrafficControlPanel from './TrafficControlPanel';
import TrafficAlertsList from './TrafficAlertsList';
import { initializeMockData } from '../data/mockTrafficData';

const TrafficDashboard: React.FC = () => {
  const [data, setData] = useState(initializeMockData());
  const [showTraffic, setShowTraffic] = useState(true);
  const [showIntersections, setShowIntersections] = useState(true);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showEmergencyVehicles, setShowEmergencyVehicles] = useState(true);
  
  // Refresh data periodically (simulates real-time updates)
  useEffect(() => {
    const interval = setInterval(() => {
      setData(initializeMockData());
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Refresh data manually
  const refreshData = () => {
    setData(initializeMockData());
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficMap 
            trafficPoints={data.trafficPoints}
            intersections={data.intersections}
            predictions={data.predictions}
            alerts={data.alerts}
            emergencyVehicles={data.emergencyVehicles}
            showTraffic={showTraffic}
            showIntersections={showIntersections}
            showPredictions={showPredictions}
            showAlerts={showAlerts}
            showEmergencyVehicles={showEmergencyVehicles}
          />
          <div className="mt-6">
            <TrafficStatsSummary metrics={data.metrics} alerts={data.alerts} />
          </div>
        </div>
        
        <div className="space-y-6">
          <TrafficControlPanel 
            showTraffic={showTraffic}
            setShowTraffic={setShowTraffic}
            showIntersections={showIntersections}
            setShowIntersections={setShowIntersections}
            showPredictions={showPredictions}
            setShowPredictions={setShowPredictions}
            showAlerts={showAlerts}
            setShowAlerts={setShowAlerts}
            showEmergencyVehicles={showEmergencyVehicles}
            setShowEmergencyVehicles={setShowEmergencyVehicles}
            refreshData={refreshData}
          />
          
          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
            </TabsList>
            <TabsContent value="alerts">
              <TrafficAlertsList alerts={data.alerts} />
            </TabsContent>
            <TabsContent value="routes">
              <div className="h-[400px] bg-white rounded-md shadow border p-4 flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-semibold text-traffic-blue mb-2">Route Planning</h3>
                <p className="text-muted-foreground">
                  Select origin and destination points on the map to calculate optimal routes based on current traffic conditions.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TrafficDashboard;
