// CustomHeader.jsx
import React, { useState } from 'react';
import { 
  BarChart3, 
  Upload, 
  Database, 
  LineChart, 
  TrendingUp,
  Bell,
  User,
  LogOut,
  Settings,
  Search,
  Menu
} from 'lucide-react';

const CustomHeader = ({ sidebarCollapsed }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Section - Mobile Menu + Breadcrumb */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle (only shown when sidebar is collapsed) */}
            {sidebarCollapsed && (
              <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu size={20} className="text-gray-600" />
              </button>
            )}
            
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Welcome User!</span>
            </div>
          </div>

          {/* Center Section - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files, visualizations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            
            {/* Quick Actions (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-1">
              <QuickActionButton icon={<Upload size={18} />} tooltip="Upload CSV" />
              <QuickActionButton icon={<Database size={18} />} tooltip="View Data" />
              <QuickActionButton icon={<LineChart size={18} />} tooltip="Create Chart" />
              <QuickActionButton icon={<TrendingUp size={18} />} tooltip="Run Prediction" />
            </div>

            {/* Divider */}
            <div className="hidden md:block h-6 w-px bg-gray-200"></div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-700">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <NotificationItem 
                      title="CSV Upload Complete"
                      description="sales_data.csv has been processed successfully"
                      time="5 min ago"
                    />
                    <NotificationItem 
                      title="Prediction Ready"
                      description="Revenue forecast for Q4 is now available"
                      time="1 hour ago"
                      active
                    />
                    <NotificationItem 
                      title="Export Completed"
                      description="Your visualization has been exported as PNG"
                      time="2 hours ago"
                    />
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden lg:block text-sm font-medium text-gray-700">John Doe</span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <ProfileMenuItem icon={<User size={16} />} text="Your Profile" />
                  <ProfileMenuItem icon={<Settings size={16} />} text="Settings" />
                  <div className="border-t border-gray-100 my-1"></div>
                  <ProfileMenuItem icon={<LogOut size={16} />} text="Logout" className="text-red-600" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search (shown only on small screens) */}
        <div className="md:hidden py-3 border-t border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Progress Bar (shown during file processing) */}
      <div className="h-0.5 bg-gray-100 w-full">
        <div className="h-full bg-blue-600 w-0 transition-all duration-500"></div>
      </div>
    </header>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon, tooltip }) => (
  <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
    {icon}
    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
      {tooltip}
    </span>
  </button>
);

// Notification Item Component
const NotificationItem = ({ title, description, time, active }) => (
  <div className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${active ? 'bg-blue-50' : ''}`}>
    <div className="flex justify-between items-start">
      <p className={`text-sm font-medium ${active ? 'text-blue-600' : 'text-gray-700'}`}>
        {title}
      </p>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </div>
);

// Profile Menu Item Component
const ProfileMenuItem = ({ icon, text, className = '' }) => (
  <button className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-left ${className}`}>
    <span className="text-gray-500">{icon}</span>
    <span className="text-sm">{text}</span>
  </button>
);

export default CustomHeader;