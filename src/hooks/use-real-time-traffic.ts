
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { TrafficPoint, TrafficMetrics } from '../types/traffic';

// Use Vite's import.meta.env instead of process.env for environment variables
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

interface UseRealTimeTrafficOptions {
  enabled?: boolean;
  area?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface RealTimeTrafficData {
  trafficPoints: TrafficPoint[];
  systemMetrics: any;
  isConnected: boolean;
  error: string | null;
}

export const useRealTimeTraffic = (options: UseRealTimeTrafficOptions = {}): RealTimeTrafficData => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [trafficPoints, setTrafficPoints] = useState<TrafficPoint[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { enabled = true, area } = options;
  
  useEffect(() => {
    if (!enabled) return;
    
    const socketInstance = io(API_URL);
    setSocket(socketInstance);
    
    // Connection events
    socketInstance.on('connect', () => {
      console.log('Connected to real-time traffic data');
      setIsConnected(true);
      setError(null);
      
      // Subscribe to area-specific updates if area is provided
      if (area) {
        socketInstance.emit('subscribe-area', area);
      }
    });
    
    socketInstance.on('disconnect', () => {
      console.log('Disconnected from real-time traffic data');
      setIsConnected(false);
    });
    
    socketInstance.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError(`Connection error: ${err.message}`);
    });
    
    // Data events
    socketInstance.on('traffic-data', (data: TrafficPoint[]) => {
      setTrafficPoints(data);
    });
    
    socketInstance.on('traffic-update', (data: TrafficPoint[]) => {
      setTrafficPoints(data);
    });
    
    socketInstance.on('system-metrics', (data: any) => {
      setSystemMetrics(data);
    });
    
    socketInstance.on('metrics-update', (data: any) => {
      setSystemMetrics(data);
    });
    
    socketInstance.on('new-traffic-point', (point: TrafficPoint) => {
      setTrafficPoints(prevPoints => {
        const newPoints = [...prevPoints];
        // Remove the oldest point if we have more than 100
        if (newPoints.length >= 100) {
          newPoints.pop();
        }
        // Add the new point at the beginning
        return [point, ...newPoints];
      });
    });
    
    socketInstance.on('area-traffic-data', (data: TrafficPoint[]) => {
      if (area) {
        setTrafficPoints(data);
      }
    });
    
    socketInstance.on('new-area-traffic-point', (point: TrafficPoint) => {
      if (area) {
        setTrafficPoints(prevPoints => {
          const newPoints = [...prevPoints];
          // Remove the oldest point if we have more than 100
          if (newPoints.length >= 100) {
            newPoints.pop();
          }
          // Add the new point at the beginning
          return [point, ...newPoints];
        });
      }
    });
    
    socketInstance.on('error', (err: any) => {
      console.error('Socket error:', err);
      setError(err.message || 'Unknown error');
    });
    
    // Cleanup
    return () => {
      if (area) {
        socketInstance.emit('unsubscribe-area', area);
      }
      socketInstance.disconnect();
    };
  }, [enabled]);
  
  // Subscribe/unsubscribe to area updates when area changes
  useEffect(() => {
    if (!socket || !isConnected) return;
    
    if (area) {
      socket.emit('subscribe-area', area);
    }
    
    return () => {
      if (area) {
        socket.emit('unsubscribe-area', area);
      }
    };
  }, [area, socket, isConnected]);
  
  return {
    trafficPoints,
    systemMetrics,
    isConnected,
    error
  };
};
