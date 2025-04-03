
import React from 'react';
import { Bell, Settings, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header: React.FC = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <div className="rounded-full bg-traffic-blue w-8 h-8 flex items-center justify-center text-white font-semibold mr-2">
                B
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-traffic-blue">
                  Bengaluru Traffic
                </h1>
                <p className="text-xs text-muted-foreground hidden md:block">
                  Intelligent Traffic Management System
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center max-w-sm w-full mx-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Search locations, routes..."
                className="pl-8 w-full bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="hidden md:block border-l pl-2 ml-2">
              <Button size="sm" variant="default">
                Traffic Authority Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
