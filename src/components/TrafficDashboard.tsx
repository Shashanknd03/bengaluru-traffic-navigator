
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrafficMap from './TrafficMap';
import TrafficStatsSummary from './TrafficStatsSummary';
import TrafficControlPanel from './TrafficControlPanel';
import TrafficAlertsList from './TrafficAlertsList';
import { initializeMockData } from '../data/mockTrafficData';
import { useRealTimeTraffic } from '../hooks/use-real-time-traffic';
import { useToast } from '@/components/ui/use-toast';

const TrafficDashboard: React.FC = () => {
  const [data, setData] = useState(initializeMockData());
  const [showTraffic, setShowTraffic] = useState(true);
  const [showIntersections, setShowIntersections] = useState(true);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showEmergencyVehicles, setShowEmergencyVehicles] = useState(true);
  const [useRealTimeData, setUseRealTimeData] = useState(true);
  const { toast } = useToast();
  
  // Define the area for Bengaluru
  const bengaluruArea = {
    north: 13.1,
    south: 12.8,
    east: 77.8,
    west: 77.4
  };
  
  // Use the real-time traffic hook
  const { 
    trafficPoints, 
    systemMetrics, 
    isConnected, 
    error 
  } = useRealTimeTraffic({
    enabled: useRealTimeData,
    area: bengaluruArea
  });
  
  // Update data when real-time data changes
  useEffect(() => {
    if (useRealTimeData && trafficPoints && trafficPoints.length > 0) {
      setData(prevData => ({
        ...prevData,
        trafficPoints: trafficPoints
      }));
      
      // Show toast on first connection
      if (isConnected) {
        toast({
          title: "Connected to real-time traffic data",
          description: `Receiving data from ${trafficPoints.length} traffic sensors across Bengaluru.`,
          variant: "default",
        });
      }
    }
  }, [trafficPoints, isConnected, useRealTimeData]);
  
  // Update system metrics when they change
  useEffect(() => {
    if (useRealTimeData && systemMetrics) {
      setData(prevData => ({
        ...prevData,
        metrics: {
          ...prevData.metrics,
          averageSpeed: systemMetrics.avgSpeed || prevData.metrics.averageSpeed,
          congestionLevel: systemMetrics.avgCongestion || prevData.metrics.congestionLevel,
          vehicleCount: systemMetrics.totalVehicles || prevData.metrics.vehicleCount,
          timestamp: new Date().toISOString()
        }
      }));
    }
  }, [systemMetrics, useRealTimeData]);
  
  // Show error toast if there's a connection error
  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  // Refresh data periodically (simulates real-time updates when not using real-time API)
  useEffect(() => {
    if (useRealTimeData) return; // Don't use interval if using real-time data
    
    const interval = setInterval(() => {
      setData(initializeMockData());
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [useRealTimeData]);
  
  // Refresh data manually
  const refreshData = () => {
    if (useRealTimeData) {
      toast({
        title: "Using real-time data",
        description: "The data is already being updated in real-time.",
        variant: "default",
      });
    } else {
      setData(initializeMockData());
      toast({
        title: "Data refreshed",
        description: "Traffic data has been refreshed with new information.",
        variant: "default",
      });
    }
  };
  
  // Toggle real-time data
  const toggleRealTimeData = () => {
    setUseRealTimeData(prev => !prev);
    toast({
      title: !useRealTimeData ? "Real-time data enabled" : "Switched to mock data",
      description: !useRealTimeData 
        ? "Now showing live traffic data from Bengaluru." 
        : "Now using simulated traffic data.",
      variant: "default",
    });
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-traffic-blue">Bengaluru Traffic Visualization</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleRealTimeData}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  useRealTimeData 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                {useRealTimeData ? 'Live Data' : 'Mock Data'}
              </button>
              {useRealTimeData && (
                <div className={`flex items-center gap-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'} animate-pulse`}></div>
                  <span className="text-xs">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              )}
            </div>
          </div>
          
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
            useRealTimeData={useRealTimeData}
            toggleRealTimeData={toggleRealTimeData}
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
