
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, LineChart, HeatMap } from '@/components/ui/chart';
import { Calendar, MapPin, AlertTriangle, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { predictTraffic } from '@/services/api';

const FuturePredictions = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [predictionType, setPredictionType] = useState<'short' | 'medium' | 'long'>('short');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<any>(null);
  const [locationSearch, setLocationSearch] = useState<string>('');
  const { toast } = useToast();

  const areas = [
    { id: 'mg-road', name: 'MG Road' },
    { id: 'koramangala', name: 'Koramangala' },
    { id: 'indiranagar', name: 'Indiranagar' },
    { id: 'whitefield', name: 'Whitefield' },
    { id: 'electronic-city', name: 'Electronic City' },
    { id: 'marathahalli', name: 'Marathahalli' },
  ];

  const loadPredictions = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      setTimeout(() => {
        // Mock data for demonstration
        setPredictions({
          hourlyPredictions: [
            { hour: '00:00', predicted: 110, actual: 120 },
            { hour: '01:00', predicted: 70, actual: 80 },
            { hour: '02:00', predicted: 50, actual: 60 },
            { hour: '03:00', predicted: 30, actual: 40 },
            { hour: '04:00', predicted: 60, actual: 70 },
            { hour: '05:00', predicted: 140, actual: 150 },
            { hour: '06:00', predicted: 300, actual: 320 },
            { hour: '07:00', predicted: 550, actual: 580 },
            { hour: '08:00', predicted: 800, actual: 820 },
            { hour: '09:00', predicted: 930, actual: 950 },
            { hour: '10:00', predicted: 730, actual: 750 },
            { hour: '11:00', predicted: 650, actual: 680 },
            { hour: '12:00', predicted: 700, actual: 720 },
            { hour: '13:00', predicted: 650, actual: 670 },
            { hour: '14:00', predicted: 600, actual: 620 },
            { hour: '15:00', predicted: 650, actual: 670 },
            { hour: '16:00', predicted: 720, actual: 750 },
            { hour: '17:00', predicted: 900, actual: 920 },
            { hour: '18:00', predicted: 820, actual: 850 },
            { hour: '19:00', predicted: 630, actual: 650 },
            { hour: '20:00', predicted: 420, actual: 450 },
            { hour: '21:00', predicted: 320, actual: 350 },
            { hour: '22:00', predicted: 230, actual: 250 },
            { hour: '23:00', predicted: 160, actual: 180 }
          ],
          weeklyPredictions: [
            { day: 'Monday', value: 82 },
            { day: 'Tuesday', value: 75 },
            { day: 'Wednesday', value: 78 },
            { day: 'Thursday', value: 80 },
            { day: 'Friday', value: 90 },
            { day: 'Saturday', value: 68 },
            { day: 'Sunday', value: 55 }
          ],
          hotspots: [
            { id: 1, name: 'Silk Board Junction', congestionProbability: 95, status: 'severe' },
            { id: 2, name: 'KR Puram Bridge', congestionProbability: 88, status: 'high' },
            { id: 3, name: 'Marathahalli Bridge', congestionProbability: 82, status: 'high' },
            { id: 4, name: 'Hebbal Flyover', congestionProbability: 75, status: 'medium' },
            { id: 5, name: 'Bannerghatta Road', congestionProbability: 72, status: 'medium' }
          ],
          eventImpacts: [
            { event: 'Ongoing Metro Construction', impact: 'high', areas: ['MG Road', 'Indiranagar'] },
            { event: 'Tech Park Office Hours', impact: 'high', areas: ['Whitefield', 'Electronic City'] },
            { event: 'Weekend Shopping', impact: 'medium', areas: ['Koramangala', 'Indiranagar'] },
            { event: 'Scheduled Road Maintenance', impact: 'medium', areas: ['Outer Ring Road'] }
          ],
          mlAccuracy: 92,
          predictionConfidence: 85,
          lastUpdated: new Date().toISOString()
        });

        setIsLoading(false);
        toast({
          title: "Predictions loaded",
          description: `Traffic predictions for ${selectedArea === 'all' ? 'all areas' : selectedArea} have been updated.`,
        });
      }, 1500);
    } catch (error) {
      console.error("Error loading predictions:", error);
      toast({
        title: "Error",
        description: "Failed to load traffic predictions. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Load predictions on initial render and when filters change
  useEffect(() => {
    loadPredictions();
  }, [selectedArea, predictionType]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      loadPredictions();
      toast({
        title: "Date selected",
        description: `Showing predictions for ${date.toLocaleDateString()}`,
      });
    }
  };

  const handleSearch = () => {
    if (locationSearch.trim() === '') {
      toast({
        title: "Search error",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }
    
    // Find matching area or use custom location
    const matchedArea = areas.find(area => 
      area.name.toLowerCase().includes(locationSearch.toLowerCase())
    );
    
    if (matchedArea) {
      setSelectedArea(matchedArea.id);
    } else {
      setSelectedArea('custom');
      toast({
        title: "Custom location",
        description: `Showing predictions for "${locationSearch}" (approximated)`,
      });
    }
    
    loadPredictions();
  };

  // Helper function to get color based on congestion status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-amber-500';
      case 'high': return 'bg-red-500';
      case 'severe': return 'bg-purple-900';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 flex items-center space-x-2">
          <Input 
            placeholder="Search location..." 
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="sm">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="md:col-span-3">
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bengaluru</SelectItem>
              {areas.map(area => (
                <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-3 flex items-center space-x-2">
          <DatePicker date={selectedDate} setDate={handleDateChange} />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {selectedDate ? selectedDate.toLocaleDateString() : 'Select date'}
          </span>
        </div>
        
        <div className="md:col-span-2">
          <Button onClick={loadPredictions} disabled={isLoading} className="w-full">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Prediction Type Selection */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={predictionType} onValueChange={(value: 'short' | 'medium' | 'long') => setPredictionType(value)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="short">Short-term (24h)</TabsTrigger>
              <TabsTrigger value="medium">Medium-term (Week)</TabsTrigger>
              <TabsTrigger value="long">Long-term (Month)</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Hourly Predictions Graph */}
      {predictions && predictionType === 'short' && (
        <Card>
          <CardHeader>
            <CardTitle>Hourly Traffic Predictions</CardTitle>
            <CardDescription>
              Showing predicted vs. actual traffic volumes for the next 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart 
                data={predictions.hourlyPredictions.map((item: any) => ({
                  name: item.hour,
                  Predicted: item.predicted,
                  Actual: item.actual
                }))}
                xAxis="name"
                categories={["Predicted", "Actual"]}
                colors={["blue", "green"]}
                valueFormatter={(value: number) => `${value} vehicles`}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Weekly Predictions */}
      {predictions && predictionType === 'medium' && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Congestion Forecast</CardTitle>
            <CardDescription>
              Predicted congestion levels for the upcoming week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart 
                data={predictions.weeklyPredictions.map((item: any) => ({
                  name: item.day,
                  'Congestion (%)': item.value
                }))}
                xAxis="name"
                categories={["Congestion (%)"]}
                colors={["purple"]}
                valueFormatter={(value: number) => `${value}%`}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Long Term Trends */}
      {predictions && predictionType === 'long' && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Traffic Trend Forecast</CardTitle>
            <CardDescription>
              Long-term predictions based on historical patterns and seasonal factors
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-center p-6">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Advanced Feature Coming Soon</h3>
              <p className="text-muted-foreground">
                Our data scientists are fine-tuning the monthly prediction models.
                Check back soon for detailed monthly forecasts!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Traffic Hotspots */}
      {predictions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Predicted Traffic Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.hotspots.map((hotspot: any) => (
                  <div key={hotspot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(hotspot.status)} mr-3`}></div>
                      <span className="font-medium">{hotspot.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">
                        {hotspot.congestionProbability}% probability
                      </span>
                      <div 
                        className={`px-2 py-1 text-xs rounded-full ${
                          hotspot.status === 'severe' ? 'bg-purple-100 text-purple-800' :
                          hotspot.status === 'high' ? 'bg-red-100 text-red-800' :
                          hotspot.status === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {hotspot.status.charAt(0).toUpperCase() + hotspot.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Event Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Event Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.eventImpacts.map((event: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{event.event}</span>
                      <div 
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          event.impact === 'high' ? 'bg-red-100 text-red-800' :
                          event.impact === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)} Impact
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Affected areas: {event.areas.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Prediction Accuracy */}
      {predictions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-2">Prediction Accuracy</span>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold mr-1">{predictions.mlAccuracy}%</span>
                  <ArrowUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="h-2.5 rounded-full bg-green-500" 
                    style={{ width: `${predictions.mlAccuracy}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-2">Confidence Level</span>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold mr-1">{predictions.predictionConfidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="h-2.5 rounded-full bg-blue-500" 
                    style={{ width: `${predictions.predictionConfidence}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-2">Last Updated</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(predictions.lastUpdated).toLocaleString()}
                  </span>
                </div>
                <Button variant="link" size="sm" className="mt-2" onClick={loadPredictions}>
                  Refresh now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FuturePredictions;
