
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertCircle, Car, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { TrafficMetrics, TrafficAlert } from '../types/traffic';

interface TrafficStatsSummaryProps {
  metrics: TrafficMetrics;
  alerts: TrafficAlert[];
}

const TrafficStatsSummary: React.FC<TrafficStatsSummaryProps> = ({ metrics, alerts }) => {
  // Count alerts by type
  const alertCounts = {
    accident: alerts.filter(a => a.type === 'accident').length,
    construction: alerts.filter(a => a.type === 'construction').length,
    event: alerts.filter(a => a.type === 'event').length,
    weatherHazard: alerts.filter(a => a.type === 'weatherHazard').length,
    roadClosure: alerts.filter(a => a.type === 'roadClosure').length,
  };
  
  // Get congestion level text and color
  const getCongestionDetails = (level: number) => {
    if (level < 30) return { text: 'Low', color: 'text-traffic-green' };
    if (level < 60) return { text: 'Moderate', color: 'text-traffic-amber' };
    if (level < 80) return { text: 'High', color: 'text-traffic-red' };
    return { text: 'Severe', color: 'text-red-800' };
  };
  
  const congestionDetails = getCongestionDetails(metrics.congestionLevel);
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Get count of critical alerts
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Car className="h-4 w-4" />
            Traffic Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Average Speed:</span>
              <span className="font-medium">{metrics.averageSpeed} km/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Congestion Level:</span>
              <span className={`font-medium ${congestionDetails.color}`}>
                {congestionDetails.text} ({metrics.congestionLevel}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Vehicle Count:</span>
              <span className="font-medium">{metrics.vehicleCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Last Updated:</span>
              <span className="font-medium">{formatTime(metrics.timestamp)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Accidents:</span>
              <span className="font-medium">{alertCounts.accident}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Road Closures:</span>
              <span className="font-medium">{alertCounts.roadClosure}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Construction:</span>
              <span className="font-medium">{alertCounts.construction}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Weather Hazards:</span>
              <span className="font-medium">{alertCounts.weatherHazard}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Events:</span>
              <span className="font-medium">{alertCounts.event}</span>
            </div>
            {criticalAlerts > 0 && (
              <div className="mt-2 px-2 py-1 bg-red-50 border border-red-200 rounded text-red-600 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {criticalAlerts} critical alert{criticalAlerts !== 1 ? 's' : ''} requiring attention
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Hotspots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="traffic-status-indicator status-red mt-1"></div>
              <div>
                <p className="font-medium text-sm">Silk Board Junction</p>
                <p className="text-muted-foreground text-xs">Severe congestion, 5-10 km/h</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="traffic-status-indicator status-red mt-1"></div>
              <div>
                <p className="font-medium text-sm">KR Puram Bridge</p>
                <p className="text-muted-foreground text-xs">Heavy congestion, 8-12 km/h</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="traffic-status-indicator status-amber mt-1"></div>
              <div>
                <p className="font-medium text-sm">Marathahalli Bridge</p>
                <p className="text-muted-foreground text-xs">Moderate congestion, 15-20 km/h</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="traffic-status-indicator status-amber mt-1"></div>
              <div>
                <p className="font-medium text-sm">Hebbal Flyover</p>
                <p className="text-muted-foreground text-xs">Moderate congestion, 18-22 km/h</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficStatsSummary;
