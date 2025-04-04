
import React from 'react';
import Header from '@/components/Header';
import FuturePredictions from '@/components/FuturePredictions';

const Predictions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Traffic Predictions</h1>
          <p className="text-gray-600">
            View future traffic predictions based on historical patterns and real-time data.
          </p>
        </div>
        
        <FuturePredictions />
      </main>
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 Bengaluru Traffic Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default Predictions;
