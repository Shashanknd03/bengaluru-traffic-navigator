
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface PredictionData {
  time: string;
  predicted: number;
  historical: number;
}

const FuturePredictions: React.FC = () => {
  const [location, setLocation] = useState<string>('Silk Board Junction');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const { toast } = useToast();

  // Generate mock prediction data
  const generatePredictions = (location: string, date: string): PredictionData[] => {
    const data: PredictionData[] = [];
    const baseValues: Record<string, number> = {
      'Silk Board Junction': 85,
      'KR Puram Bridge': 80,
      'Marathahalli Bridge': 70,
      'Hebbal Flyover': 75,
      'MG Road': 65,
      'Electronic City': 60,
    };
    
    const baseValue = baseValues[location] || 55;
    const currentHour = new Date().getHours();
    
    // Generate 24 hours of data
    for (let i = 0; i < 24; i++) {
      let timeMultiplier = 1;
      
      // Morning rush hour: 8-10 AM
      if (i >= 8 && i <= 10) timeMultiplier = 1.4;
      // Evening rush hour: 5-8 PM
      else if (i >= 17 && i <= 20) timeMultiplier = 1.5;
      // Late night: 11 PM - 5 AM
      else if (i >= 23 || i <= 5) timeMultiplier = 0.6;
      
      // Add variations based on selected date (weekday vs weekend)
      const selectedDate = new Date(date);
      const isWeekend = [0, 6].includes(selectedDate.getDay());
      const dayModifier = isWeekend ? 0.8 : 1.2;
      
      // Add some randomness
      const randomFactor = 0.9 + Math.random() * 0.2;
      
      // Calculate if this hour is in the past, present, or future
      const isPast = i < currentHour;
      
      // Historical data has some natural variation
      const historical = isPast 
        ? Math.min(100, Math.round(baseValue * timeMultiplier * dayModifier * randomFactor))
        : null;
      
      // Predicted data has less variation further in the future
      const predictedRandomness = isPast ? 0 : (0.85 + Math.random() * 0.3);
      const predicted = Math.min(100, Math.round(baseValue * timeMultiplier * dayModifier * predictedRandomness));
      
      data.push({
        time: i < 10 ? `0${i}:00` : `${i}:00`,
        predicted: predicted,
        historical: historical,
      });
    }
    
    return data;
  };

  // Load data when inputs change
  const loadData = () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newData = generatePredictions(location, date);
      setPredictionData(newData);
      setLoading(false);
      
      toast({
        title: "Prediction Updated",
        description: `Traffic prediction for ${location} on ${date} has been generated.`,
      });
    }, 1500);
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Traffic Predictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex">
                <Input 
                  id="location" 
                  placeholder="Enter a location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="flex">
                <Input 
                  id="date" 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button onClick={loadData} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Prediction'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>24-Hour Traffic Prediction</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>Current time: {new Date().toLocaleTimeString()}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <ReferenceLine x={new Date().getHours() + ":00"} stroke="red" label="Now" />
                <Line 
                  type="monotone" 
                  dataKey="historical" 
                  name="Historical Data" 
                  stroke="#8884d8" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  name="Predicted Traffic" 
                  stroke="#82ca9d" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  activeDot={{ r: 6 }}
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <h3 className="font-medium text-amber-800 mb-2">Peak Traffic Prediction</h3>
              <p className="text-sm text-amber-700">Expected heavy congestion between 17:00 - 19:00 with 85% traffic density.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Best Travel Time</h3>
              <p className="text-sm text-green-700">Optimal travel window between 13:00 - 15:00 with less than 45% congestion.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Traffic Trend</h3>
              <p className="text-sm text-blue-700">Overall traffic is expected to be 12% higher than the same day last week.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FuturePredictions;
