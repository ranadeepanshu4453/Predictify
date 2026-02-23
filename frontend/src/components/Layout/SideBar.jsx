// SideBar.jsx
import React, { useState } from "react";
import { Link } from "react-router";

import {
  Upload,
  Database,
  LineChart,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  HelpCircle,
  BarChart3,
  PieChart,
  Download,
  Menu,
} from "lucide-react";

const SideBar = ({ collapsed, setCollapsed }) => {
  const [activeItem, setActiveItem] = useState("visualize");

  const menuItems = [
    { id: "dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { id: "upload", icon: <Upload size={20} />, label: "Upload CSV" },
    { id: "data", icon: <Database size={20} />, label: "Data Table" },
    { id: "visualize", icon: <LineChart size={20} />, label: "Visualize" },
    { id: "charts", icon: <PieChart size={20} />, label: "Charts" },
    { id: "predict", icon: <TrendingUp size={20} />, label: "Predict" },
    { id: "export", icon: <Download size={20} />, label: "Export" },
  ];

  const bottomMenuItems = [
    { id: "settings", icon: <Settings size={20} />, label: "Settings" },
    { id: "help", icon: <HelpCircle size={20} />, label: "Help" },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo and Toggle */}
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } p-4 border-b border-gray-200`}
      >
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-800">CSV Analytics</span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Link to={`/${item.id === "/" ? "" : item.id}`}>
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  active={activeItem === item.id}
                  collapsed={collapsed}
                  onClick={() => setActiveItem(item.id)}
                />
              </Link> 
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Bottom Navigation */}
        <div className="space-y-1">
          {bottomMenuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.id}
              collapsed={collapsed}
              onClick={() => setActiveItem(item.id)}
            />
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div
        className={`p-4 border-t border-gray-200 ${
          collapsed ? "text-center" : ""
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-500 truncate">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, active, collapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all
        ${collapsed ? "justify-center" : ""}
        ${
          active
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      <span className={`${active ? "text-blue-600" : "text-gray-500"}`}>
        {icon}
      </span>
      {!collapsed && (
        <span className="flex-1 text-sm font-medium text-left">{label}</span>
      )}
      {collapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
          {label}
        </span>
      )}
    </button>
  );
};

export default SideBar;
