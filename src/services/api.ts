
import axios from 'axios';
import { 
  TrafficPoint, 
  TrafficAlert, 
  TrafficMetrics, 
  TrafficPredictionDetail,
  RoadSegment,
  TrafficIncident,
  SensorData,
  TrafficSystem,
  TrafficSignalTiming
} from '../types/traffic';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Traffic Points API
export const fetchTrafficPoints = async () => {
  const response = await api.get<TrafficPoint[]>('/traffic/points');
  return response.data;
};

export const fetchTrafficPointsByArea = async (
  north: number,
  south: number,
  east: number,
  west: number
) => {
  const response = await api.get<TrafficPoint[]>('/traffic/points/area', {
    params: { north, south, east, west }
  });
  return response.data;
};

export const addTrafficPoint = async (trafficPoint: Omit<TrafficPoint, 'id'>) => {
  const response = await api.post<TrafficPoint>('/traffic/points', trafficPoint);
  return response.data;
};

// Traffic Alerts API
export const fetchTrafficAlerts = async (filters?: { severity?: string, type?: string, source?: string, limit?: number }) => {
  const response = await api.get<TrafficAlert[]>('/alerts', { params: filters });
  return response.data;
};

export const fetchTrafficAlertsByArea = async (
  north: number,
  south: number,
  east: number,
  west: number,
  limit?: number
) => {
  const response = await api.get<TrafficAlert[]>('/alerts/area', {
    params: { north, south, east, west, limit }
  });
  return response.data;
};

export const fetchTrafficAlertsByProximity = async (
  lat: number,
  lng: number,
  radius: number = 1000,
  limit?: number
) => {
  const response = await api.get<TrafficAlert[]>('/alerts/proximity', {
    params: { lat, lng, radius, limit }
  });
  return response.data;
};

export const createTrafficAlert = async (alert: Omit<TrafficAlert, 'id'>) => {
  const response = await api.post<TrafficAlert>('/alerts', alert);
  return response.data;
};

export const updateTrafficAlert = async (id: string, update: Partial<TrafficAlert>) => {
  const response = await api.put<TrafficAlert>(`/alerts/${id}`, update);
  return response.data;
};

export const closeTrafficAlert = async (id: string) => {
  const response = await api.patch<TrafficAlert>(`/alerts/${id}/close`);
  return response.data;
};

export const fetchAlertStatistics = async (timeframe: 'hour' | 'day' | 'week' | 'month' = 'day') => {
  const response = await api.get('/alerts/statistics', {
    params: { timeframe }
  });
  return response.data;
};

// Traffic Metrics API
export const fetchTrafficMetrics = async () => {
  const response = await api.get<TrafficMetrics>('/traffic/metrics');
  return response.data;
};

export const recordTrafficMetrics = async (metrics: any) => {
  const response = await api.post('/metrics', metrics);
  return response.data;
};

export const fetchLatestMetricsByArea = async (
  north: number,
  south: number,
  east: number,
  west: number
) => {
  const response = await api.get('/metrics/area', {
    params: { north, south, east, west }
  });
  return response.data;
};

export const fetchHistoricalMetrics = async (
  roadSegmentId: string,
  interval: '5min' | '15min' | 'hour' | 'day' = 'hour',
  duration: string = '24h'
) => {
  const response = await api.get('/metrics/historical', {
    params: { roadSegmentId, interval, duration }
  });
  return response.data;
};

export const fetchTrafficOverview = async () => {
  const response = await api.get('/metrics/overview');
  return response.data;
};

export const predictTraffic = async (roadSegmentId: string) => {
  const response = await api.get<TrafficPredictionDetail>('/metrics/predict', {
    params: { roadSegmentId }
  });
  return response.data;
};

// Road Segments API
export const fetchRoadSegments = async () => {
  const response = await api.get<RoadSegment[]>('/traffic/segments');
  return response.data;
};

export const fetchRoadSegmentById = async (id: string) => {
  const response = await api.get<RoadSegment>(`/traffic/segments/${id}`);
  return response.data;
};

export const fetchRoadSegmentsByArea = async (
  north: number,
  south: number,
  east: number,
  west: number
) => {
  const response = await api.get<RoadSegment[]>('/traffic/segments/area', {
    params: { north, south, east, west }
  });
  return response.data;
};

// Traffic Incidents API
export const fetchTrafficIncidents = async (status?: 'active' | 'resolved' | 'inProgress') => {
  const response = await api.get<TrafficIncident[]>('/traffic/incidents', {
    params: { status }
  });
  return response.data;
};

export const reportTrafficIncident = async (incident: Omit<TrafficIncident, 'id'>) => {
  const response = await api.post<TrafficIncident>('/traffic/incidents', incident);
  return response.data;
};

export const updateTrafficIncident = async (id: string, update: Partial<TrafficIncident>) => {
  const response = await api.put<TrafficIncident>(`/traffic/incidents/${id}`, update);
  return response.data;
};

// Sensor Data API
export const fetchSensors = async (type?: string, status?: string) => {
  const response = await api.get<SensorData[]>('/traffic/sensors', {
    params: { type, status }
  });
  return response.data;
};

export const fetchSensorById = async (id: string) => {
  const response = await api.get<SensorData>(`/traffic/sensors/${id}`);
  return response.data;
};

export const updateSensorStatus = async (id: string, status: string) => {
  const response = await api.patch<SensorData>(`/traffic/sensors/${id}/status`, { status });
  return response.data;
};

// Traffic Systems API
export const fetchTrafficSystems = async (type?: string, status?: string) => {
  const response = await api.get<TrafficSystem[]>('/traffic/systems', {
    params: { type, status }
  });
  return response.data;
};

export const fetchTrafficSystemById = async (id: string) => {
  const response = await api.get<TrafficSystem>(`/traffic/systems/${id}`);
  return response.data;
};

export const updateTrafficSystem = async (id: string, update: Partial<TrafficSystem>) => {
  const response = await api.put<TrafficSystem>(`/traffic/systems/${id}`, update);
  return response.data;
};

// Signal Timing API
export const fetchSignalTimings = async (intersectionId: string) => {
  const response = await api.get<TrafficSignalTiming>(`/traffic/signals/${intersectionId}/timing`);
  return response.data;
};

export const updateSignalTiming = async (intersectionId: string, timing: Partial<TrafficSignalTiming>) => {
  const response = await api.put<TrafficSignalTiming>(`/traffic/signals/${intersectionId}/timing`, timing);
  return response.data;
};

export const optimizeSignalTiming = async (intersectionId: string) => {
  const response = await api.post<TrafficSignalTiming>(`/traffic/signals/${intersectionId}/optimize`);
  return response.data;
};

export default api;
