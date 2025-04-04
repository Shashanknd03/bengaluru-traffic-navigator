
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, Filter, MapPin, RefreshCw, Search } from 'lucide-react';
import { fetchTrafficPoints, fetchTrafficMetrics, fetchHistoricalMetrics } from '@/services/api';

const TrafficAnalytics = () => {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [area, setArea] = useState<string>('all');
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        // Mock data for demonstration
        setMetrics({
          averageSpeed: 32,
          congestionLevel: 68,
          trafficVolume: 8540,
          peakHours: ['8:00 AM - 10:00 AM', '5:00 PM - 7:00 PM'],
          incidents: 12
        });

        setAnalyticsData({
          hourlyTraffic: [
            { hour: '00:00', volume: 120 },
            { hour: '01:00', volume: 80 },
            { hour: '02:00', volume: 60 },
            { hour: '03:00', volume: 40 },
            { hour: '04:00', volume: 70 },
            { hour: '05:00', volume: 150 },
            { hour: '06:00', volume: 320 },
            { hour: '07:00', volume: 580 },
            { hour: '08:00', volume: 820 },
            { hour: '09:00', volume: 950 },
            { hour: '10:00', volume: 750 },
            { hour: '11:00', volume: 680 },
            { hour: '12:00', volume: 720 },
            { hour: '13:00', volume: 670 },
            { hour: '14:00', volume: 620 },
            { hour: '15:00', volume: 670 },
            { hour: '16:00', volume: 750 },
            { hour: '17:00', volume: 920 },
            { hour: '18:00', volume: 850 },
            { hour: '19:00', volume: 650 },
            { hour: '20:00', volume: 450 },
            { hour: '21:00', volume: 350 },
            { hour: '22:00', volume: 250 },
            { hour: '23:00', volume: 180 }
          ],
          congestionByArea: [
            { area: 'MG Road', level: 85 },
            { area: 'Koramangala', level: 72 },
            { area: 'Indiranagar', level: 68 },
            { area: 'Whitefield', level: 92 },
            { area: 'Electronic City', level: 78 },
            { area: 'HSR Layout', level: 65 },
            { area: 'Marathahalli', level: 88 }
          ],
          trafficByVehicleType: [
            { type: 'Cars', percentage: 45 },
            { type: 'Two Wheelers', percentage: 30 },
            { type: 'Public Transport', percentage: 15 },
            { type: 'Commercial', percentage: 8 },
            { type: 'Others', percentage: 2 }
          ]
        });

        setIsLoading(false);
        toast({
          title: "Data refreshed",
          description: `Loaded traffic analytics data for ${timeframe} in ${area === 'all' ? 'all areas' : area}`,
        });
      }, 1500);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load traffic analytics data. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Load data on initial render and filter changes
  useEffect(() => {
    loadData();
  }, [timeframe, area]);

  const handleSearch = () => {
    if (locationSearch.trim() === '') {
      toast({
        title: "Search error",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }
    
    setArea(locationSearch);
    loadData();
    toast({
      title: "Search applied",
      description: `Showing results for "${locationSearch}"`,
    });
  };

  const handleDateRangeFilter = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }
    
    if (startDate > endDate) {
      toast({
        title: "Date error",
        description: "Start date cannot be after end date",
        variant: "destructive",
      });
      return;
    }
    
    loadData();
    toast({
      title: "Date range applied",
      description: `Showing data from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex w-full items-center space-x-2">
          <Input 
            placeholder="Search location..." 
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <Select value={timeframe} onValueChange={(value: 'today' | 'week' | 'month') => setTimeframe(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex space-x-2">
          <DatePicker date={startDate} setDate={setStartDate} />
          <span className="flex items-center">-</span>
          <DatePicker date={endDate} setDate={setEndDate} />
          <Button onClick={handleDateRangeFilter} size="sm" variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={loadData} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </>
          )}
        </Button>
      </div>
      
      {/* Traffic Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-2">Average Speed</span>
                <span className="text-3xl font-bold">{metrics.averageSpeed}</span>
                <span className="text-sm text-muted-foreground">km/h</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-2">Congestion Level</span>
                <span className="text-3xl font-bold">{metrics.congestionLevel}%</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      metrics.congestionLevel < 50 ? 'bg-green-500' : 
                      metrics.congestionLevel < 75 ? 'bg-amber-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${metrics.congestionLevel}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-2">Total Volume</span>
                <span className="text-3xl font-bold">{metrics.trafficVolume.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">vehicles</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-2">Incidents</span>
                <span className="text-3xl font-bold">{metrics.incidents}</span>
                <span className="text-sm text-muted-foreground">reported today</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Analytics Tabs */}
      {analyticsData && (
        <Tabs defaultValue="hourly" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="hourly">Hourly Traffic</TabsTrigger>
            <TabsTrigger value="areas">Area Congestion</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicle Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hourly" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Traffic Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart 
                    data={analyticsData.hourlyTraffic.map((item: any) => ({
                      name: item.hour,
                      value: item.volume
                    }))}
                    xAxis="name"
                    categories={["value"]}
                    colors={["blue"]}
                    valueFormatter={(value: number) => `${value} vehicles`}
                    showLegend={false}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="areas" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Congestion by Area</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart 
                    data={analyticsData.congestionByArea.map((item: any) => ({
                      name: item.area,
                      value: item.level
                    }))}
                    xAxis="name"
                    categories={["value"]}
                    colors={["purple"]}
                    valueFormatter={(value: number) => `${value}%`}
                    showLegend={false}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vehicles" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Traffic by Vehicle Type</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-[300px]">
                  <PieChart 
                    data={analyticsData.trafficByVehicleType.map((item: any) => ({
                      name: item.type,
                      value: item.percentage
                    }))}
                    category="value"
                    index="name"
                    valueFormatter={(value: number) => `${value}%`}
                    colors={["blue", "teal", "amber", "purple", "pink"]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Peak Hours */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Peak Traffic Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {metrics.peakHours.map((hour: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm py-2">
                  {hour}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrafficAnalytics;
