
import React from 'react';
import Header from '@/components/Header';
import BengaluruTrafficMap from '@/components/BengaluruTrafficMap';

const BengaluruMap = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Bengaluru Traffic Map</h1>
        <p className="text-gray-600 mb-6">
          Real-time visualization of traffic conditions across Bengaluru. 
          The map shows current traffic levels from low (green) to severe (dark red).
        </p>
        <BengaluruTrafficMap />
      </main>
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 Bengaluru Traffic Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default BengaluruMap;
