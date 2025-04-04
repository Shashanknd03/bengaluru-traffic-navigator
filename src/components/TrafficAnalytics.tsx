
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useToast } from '@/components/ui/use-toast';

interface TrafficData {
  time: string;
  congestion: number;
  vehicles: number;
}

const TrafficAnalytics: React.FC = () => {
  const [location, setLocation] = useState<string>('Silk Board Junction');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [loading, setLoading] = useState<boolean>(false);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const { toast } = useToast();

  // Generate mock data based on the inputs
  const generateMockData = (location: string, timeRange: string): TrafficData[] => {
    const data: TrafficData[] = [];
    let hours = 24;
    
    if (timeRange === '12h') hours = 12;
    if (timeRange === '48h') hours = 48;
    
    // Different traffic patterns for different locations
    const patterns: Record<string, number> = {
      'Silk Board Junction': 80,
      'KR Puram Bridge': 75,
      'Marathahalli Bridge': 65,
      'Hebbal Flyover': 70,
      'MG Road': 60,
      'Electronic City': 55,
    };
    
    const baseValue = patterns[location] || 50; // Default if location not in the list
    
    for (let i = 0; i < hours; i++) {
      // Create time-based patterns with rush hours
      let timeMultiplier = 1;
      const hour = i % 24;
      
      // Morning rush hour: 8-10 AM
      if (hour >= 8 && hour <= 10) timeMultiplier = 1.5;
      // Evening rush hour: 5-8 PM
      else if (hour >= 17 && hour <= 20) timeMultiplier = 1.6;
      // Late night: 11 PM - 5 AM
      else if (hour >= 23 || hour <= 5) timeMultiplier = 0.6;
      
      // Add some randomness for realism
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      
      const congestion = Math.min(100, Math.round(baseValue * timeMultiplier * randomFactor));
      const vehicles = Math.round((2000 + Math.random() * 3000) * timeMultiplier * randomFactor);
      
      data.push({
        time: `${hour}:00`,
        congestion,
        vehicles,
      });
    }
    
    return data;
  };

  // Load data when inputs change
  const loadData = () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newData = generateMockData(location, timeRange);
      setTrafficData(newData);
      setLoading(false);
      
      toast({
        title: "Data Updated",
        description: `Showing traffic data for ${location} over the last ${timeRange}`,
      });
    }, 1000);
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Traffic Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="Enter a location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeRange">Time Range</Label>
              <select 
                id="timeRange"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="12h">Last 12 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="48h">Last 48 Hours</option>
              </select>
            </div>
          </div>
          <Button onClick={loadData} disabled={loading}>
            {loading ? 'Loading...' : 'Update Data'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traffic Congestion Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="congestion" name="Congestion Level (%)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="vehicles" name="Vehicle Count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficAnalytics;
