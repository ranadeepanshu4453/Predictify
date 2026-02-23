// Layout.jsx
import React, { useState } from 'react';
import CustomHeader from './CustomHeader';
import SideBar from './SideBar';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden`}>
        <CustomHeader sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;