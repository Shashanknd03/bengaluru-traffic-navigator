
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600 transition-colors';
  };
  
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-blue-600">
          Traffic Management System
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className={isActive('/')}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/bengaluru-map" className={isActive('/bengaluru-map')}>
                Bengaluru Map
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
