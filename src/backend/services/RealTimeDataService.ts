
import http from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import TrafficPoint from '../models/TrafficPoint';
import TrafficMetrics from '../models/TrafficMetrics';
import TrafficAlert from '../models/TrafficAlert';

class RealTimeDataService {
  private static io: Server;
  private static clients: Map<string, Socket> = new Map();
  private static areaSubscriptions: Map<string, any> = new Map();
  private static updateInterval: NodeJS.Timeout | null = null;
  private static isInitialized: boolean = false;

  static initialize(server: http.Server): void {
    if (this.isInitialized) return;

    // Initialize Socket.IO server
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // Socket connection handling
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.clients.set(socket.id, socket);

      // Send initial data
      this.sendInitialDataToClient(socket);

      // Handle area subscriptions
      socket.on('subscribe-area', (area: any) => {
        console.log(`Client ${socket.id} subscribed to area:`, area);
        this.areaSubscriptions.set(socket.id, area);
        this.sendAreaDataToClient(socket, area);
      });

      socket.on('unsubscribe-area', () => {
        console.log(`Client ${socket.id} unsubscribed from area`);
        this.areaSubscriptions.delete(socket.id);
      });

      // Cleanup on disconnect
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.clients.delete(socket.id);
        this.areaSubscriptions.delete(socket.id);
      });
    });

    // Start periodic updates
    this.startPeriodicUpdates();
    this.isInitialized = true;
    console.log('Real-time data service initialized');
  }

  static async sendInitialDataToClient(socket: Socket): Promise<void> {
    try {
      // Send traffic data
      const trafficPoints = await TrafficPoint.find()
        .sort({ timestamp: -1 })
        .limit(100)
        .lean();
      
      socket.emit('traffic-data', trafficPoints);

      // Send system metrics
      const metrics = await TrafficMetrics.findOne()
        .sort({ timestamp: -1 })
        .lean();
      
      if (metrics) {
        socket.emit('system-metrics', metrics);
      }
    } catch (error) {
      console.error('Error sending initial data:', error);
      socket.emit('error', { message: 'Failed to load initial data' });
    }
  }

  static async sendAreaDataToClient(socket: Socket, area: any): Promise<void> {
    try {
      if (!area || !area.north || !area.south || !area.east || !area.west) {
        return;
      }

      const trafficPoints = await TrafficPoint.find({
        'location.lat': { $gte: area.south, $lte: area.north },
        'location.lng': { $gte: area.west, $lte: area.east }
      })
        .sort({ timestamp: -1 })
        .limit(100)
        .lean();
      
      socket.emit('area-traffic-data', trafficPoints);
    } catch (error) {
      console.error('Error sending area data:', error);
      socket.emit('error', { message: 'Failed to load area data' });
    }
  }

  static startPeriodicUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      try {
        // Broadcast traffic updates
        await this.broadcastTrafficUpdates();
        
        // Broadcast metrics updates
        await this.broadcastMetricsUpdates();
        
        // Broadcast area-specific updates
        await this.broadcastAreaUpdates();
      } catch (error) {
        console.error('Error in periodic updates:', error);
      }
    }, 5000); // Update every 5 seconds
  }

  static async broadcastTrafficUpdates(): Promise<void> {
    try {
      const trafficPoints = await TrafficPoint.find()
        .sort({ timestamp: -1 })
        .limit(100)
        .lean();
      
      this.io.emit('traffic-update', trafficPoints);
    } catch (error) {
      console.error('Error broadcasting traffic updates:', error);
    }
  }

  static async broadcastMetricsUpdates(): Promise<void> {
    try {
      const metrics = await TrafficMetrics.findOne()
        .sort({ timestamp: -1 })
        .lean();
      
      if (metrics) {
        this.io.emit('metrics-update', metrics);
      }
    } catch (error) {
      console.error('Error broadcasting metrics updates:', error);
    }
  }

  static async broadcastAreaUpdates(): Promise<void> {
    try {
      // For each client with area subscription
      for (const [clientId, area] of this.areaSubscriptions.entries()) {
        const socket = this.clients.get(clientId);
        if (socket && area) {
          const trafficPoints = await TrafficPoint.find({
            'location.lat': { $gte: area.south, $lte: area.north },
            'location.lng': { $gte: area.west, $lte: area.east }
          })
            .sort({ timestamp: -1 })
            .limit(100)
            .lean();
          
          socket.emit('area-traffic-data', trafficPoints);
        }
      }
    } catch (error) {
      console.error('Error broadcasting area updates:', error);
    }
  }

  static shutdown(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    if (this.io) {
      this.io.close();
      console.log('Real-time data service shutdown');
    }

    this.clients.clear();
    this.areaSubscriptions.clear();
    this.isInitialized = false;
  }
}

export default RealTimeDataService;
