
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import trafficRoutes from './routes/trafficRoutes';
import alertRoutes from './routes/alertRoutes';
import metricsRoutes from './routes/metricsRoutes';
import errorHandler from './middleware/errorHandler';
import RealTimeDataService from './services/RealTimeDataService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/traffic-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/traffic', trafficRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/metrics', metricsRoutes);

// Initialize real-time data service
RealTimeDataService.initialize(server);

// Error handling middleware
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    RealTimeDataService.shutdown();
    mongoose.disconnect()
      .then(() => console.log('MongoDB disconnected'))
      .catch(err => console.error('Error disconnecting from MongoDB:', err))
      .finally(() => process.exit(0));
  });
});

export default app;
