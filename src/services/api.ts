
import axios from 'axios';
import { TrafficPoint, TrafficAlert, TrafficMetrics } from '../types/traffic';

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
export const fetchTrafficAlerts = async () => {
  const response = await api.get<TrafficAlert[]>('/alerts');
  return response.data;
};

export const fetchTrafficAlertsByArea = async (
  north: number,
  south: number,
  east: number,
  west: number
) => {
  const response = await api.get<TrafficAlert[]>('/alerts/area', {
    params: { north, south, east, west }
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

// Traffic Metrics API
export const fetchTrafficMetrics = async () => {
  const response = await api.get<TrafficMetrics>('/traffic/metrics');
  return response.data;
};

export default api;
