
import React from 'react';
import Header from '@/components/Header';
import TrafficDashboard from '@/components/TrafficDashboard';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <TrafficDashboard />
      </main>
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Bengaluru Traffic Management System | Powered by AI Analytics</p>
          <p className="text-xs mt-1">This is a demonstration system. In a real implementation, it would integrate with actual traffic sensors and data sources.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
