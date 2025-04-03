
import React from 'react';
import { TrafficAlert } from '../types/traffic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Construction, Calendar, CloudRain, Road } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrafficAlertsListProps {
  alerts: TrafficAlert[];
}

const TrafficAlertsList: React.FC<TrafficAlertsListProps> = ({ alerts }) => {
  // Sort alerts by severity (critical first)
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityRank = { critical: 0, major: 1, minor: 2 };
    return severityRank[a.severity] - severityRank[b.severity];
  });
  
  // Get alert icon based on type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'accident': return <AlertTriangle className="h-4 w-4" />;
      case 'construction': return <Construction className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'weatherHazard': return <CloudRain className="h-4 w-4" />;
      case 'roadClosure': return <Road className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  // Get alert badge color based on severity
  const getAlertBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 hover:bg-red-600';
      case 'major': return 'bg-orange-500 hover:bg-orange-600';
      case 'minor': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  // Format time difference
  const formatTimeDiff = (timestamp: string) => {
    const alertTime = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const diffMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const hours = Math.floor(diffMinutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Traffic Incidents & Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto pt-0">
        {sortedAlerts.length > 0 ? (
          <div className="space-y-3">
            {sortedAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-md ${
                  alert.severity === 'critical' 
                    ? 'bg-red-50 border border-red-100' 
                    : alert.severity === 'major'
                      ? 'bg-orange-50 border border-orange-100'
                      : 'bg-yellow-50 border border-yellow-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">
                          {alert.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {alert.affectedRoads.join(', ')}
                        </p>
                      </div>
                      <Badge className={getAlertBadgeClass(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-muted-foreground">
                        Reported {formatTimeDiff(alert.startTime)}
                      </p>
                      {alert.endTime && (
                        <p className="text-xs text-muted-foreground">
                          Est. resolution: {new Date(alert.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No active alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrafficAlertsList;
