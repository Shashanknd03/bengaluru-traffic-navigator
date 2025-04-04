
import React from 'react';
import Header from '@/components/Header';
import TrafficAnalyticsComponent from '@/components/TrafficAnalytics';

const TrafficAnalytics = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Traffic Analytics</h1>
          <p className="text-gray-600">
            Analyze traffic patterns and statistics across different locations in Bengaluru.
          </p>
        </div>
        
        <TrafficAnalyticsComponent />
      </main>
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 Bengaluru Traffic Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default TrafficAnalytics;
