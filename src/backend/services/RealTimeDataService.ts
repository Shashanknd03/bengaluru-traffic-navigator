
import { TrafficPoint } from '../../types/traffic';
import TrafficPointModel from '../models/TrafficPoint';
import TrafficMetrics from '../models/TrafficMetrics';
import { Server as SocketServer } from 'socket.io';
import http from 'http';

/**
 * Service for handling real-time traffic data processing
 */
class RealTimeDataService {
  private io: SocketServer | null = null;
  private updateInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_FREQUENCY = 10000; // 10 seconds
  
  /**
   * Initialize the real-time data service with a socket server
   */
  initialize(server: http.Server) {
    this.io = new SocketServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    this.io.on('connection', (socket) => {
      console.log('Client connected to real-time traffic data');
      
      // Send initial data to the client
      this.sendLatestTrafficData(socket);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected from real-time traffic data');
      });
      
      // Subscribe to area-specific updates
      socket.on('subscribe-area', (bounds) => {
        socket.join(`area-${this.getBoundKey(bounds)}`);
        this.sendAreaTrafficData(socket, bounds);
      });
      
      // Unsubscribe from area-specific updates
      socket.on('unsubscribe-area', (bounds) => {
        socket.leave(`area-${this.getBoundKey(bounds)}`);
      });
    });
    
    // Start periodic updates
    this.startPeriodicUpdates();
    
    return this.io;
  }
  
  /**
   * Start sending periodic traffic updates
   */
  private startPeriodicUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.updateInterval = setInterval(async () => {
      try {
        await this.broadcastTrafficUpdates();
      } catch (error) {
        console.error('Error broadcasting traffic updates:', error);
      }
    }, this.UPDATE_FREQUENCY);
  }
  
  /**
   * Broadcast traffic updates to all connected clients
   */
  private async broadcastTrafficUpdates() {
    if (!this.io) return;
    
    try {
      // Get latest traffic data
      const latestTrafficPoints = await TrafficPointModel.find()
        .sort({ timestamp: -1 })
        .limit(100);
      
      // Broadcast to all clients
      this.io.emit('traffic-update', latestTrafficPoints);
      
      // Get system metrics
      const systemMetrics = await this.getSystemMetrics();
      this.io.emit('metrics-update', systemMetrics);
      
    } catch (error) {
      console.error('Error fetching traffic data for broadcast:', error);
    }
  }
  
  /**
   * Send latest traffic data to a specific client
   */
  private async sendLatestTrafficData(socket: any) {
    try {
      const latestTrafficPoints = await TrafficPointModel.find()
        .sort({ timestamp: -1 })
        .limit(100);
      
      socket.emit('traffic-data', latestTrafficPoints);
      
      // Send system metrics as well
      const systemMetrics = await this.getSystemMetrics();
      socket.emit('system-metrics', systemMetrics);
      
    } catch (error) {
      console.error('Error sending latest traffic data:', error);
    }
  }
  
  /**
   * Send area-specific traffic data to a client
   */
  private async sendAreaTrafficData(socket: any, bounds: any) {
    try {
      const { north, south, east, west } = bounds;
      
      if (!north || !south || !east || !west) {
        socket.emit('error', { message: 'Invalid area bounds' });
        return;
      }
      
      const areaTrafficPoints = await TrafficPointModel.find({
        'location.lat': { $gte: Number(south), $lte: Number(north) },
        'location.lng': { $gte: Number(west), $lte: Number(east) }
      }).sort({ timestamp: -1 });
      
      socket.emit('area-traffic-data', areaTrafficPoints);
      
    } catch (error) {
      console.error('Error sending area traffic data:', error);
    }
  }
  
  /**
   * Notify clients about a new traffic point
   */
  async notifyNewTrafficPoint(trafficPoint: TrafficPoint) {
    if (!this.io) return;
    
    this.io.emit('new-traffic-point', trafficPoint);
    
    // Also notify area-specific rooms if applicable
    const { lat, lng } = trafficPoint.location;
    const areas = this.determineAreasForPoint(lat, lng);
    
    areas.forEach(area => {
      this.io?.to(`area-${area}`).emit('new-area-traffic-point', trafficPoint);
    });
  }
  
  /**
   * Get system-wide traffic metrics
   */
  private async getSystemMetrics() {
    try {
      // Get latest metrics
      const lastHour = new Date(Date.now() - 60 * 60 * 1000);
      
      const systemMetrics = await TrafficMetrics.aggregate([
        {
          $match: {
            timestamp: { $gte: lastHour }
          }
        },
        {
          $group: {
            _id: null,
            avgSpeed: { $avg: '$metrics.averageSpeed' },
            totalVehicles: { $sum: '$metrics.vehicleCount' },
            avgCongestion: { $avg: '$metrics.congestionLevel' },
            lastUpdate: { $max: '$timestamp' }
          }
        }
      ]);
      
      return systemMetrics[0] || {
        avgSpeed: 0,
        totalVehicles: 0,
        avgCongestion: 0,
        lastUpdate: new Date()
      };
      
    } catch (error) {
      console.error('Error getting system metrics:', error);
      return {
        avgSpeed: 0,
        totalVehicles: 0,
        avgCongestion: 0,
        lastUpdate: new Date()
      };
    }
  }
  
  /**
   * Helper to convert bounds to a string key
   */
  private getBoundKey(bounds: any): string {
    return `${bounds.north}-${bounds.south}-${bounds.east}-${bounds.west}`;
  }
  
  /**
   * Determine which area subscriptions a point belongs to
   */
  private determineAreasForPoint(lat: number, lng: number): string[] {
    // In a real implementation, this would use a spatial index or geofencing
    // For this example, we'll return a simple placeholder
    return ['bengaluru-center'];
  }
  
  /**
   * Shutdown the real-time service
   */
  shutdown() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    if (this.io) {
      this.io.close();
      this.io = null;
    }
  }
}

// Export as singleton
export default new RealTimeDataService();
