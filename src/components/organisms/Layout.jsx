import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '@/components/molecules/BottomNavigation';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;