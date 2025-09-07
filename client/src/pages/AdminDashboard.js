import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  MapPin, 
  Activity,
  FileText,
  Settings,
  Home,
  TrendingUp,
  Clock,
  Shield,
  Heart
} from 'lucide-react';

// Admin Components
import AdminOverview from '../components/admin/AdminOverview';
import IncidentManagement from '../components/admin/IncidentManagement';
import Analytics from '../components/admin/Analytics';
import HealthDashboard from '../components/admin/HealthDashboard';
import Reports from '../components/admin/Reports';

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const path = location.pathname.split('/admin/')[1] || 'overview';
    setActiveTab(path);
  }, [location]);

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/admin' },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, path: '/admin/incidents' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'health', label: 'Health & Hygiene', icon: Heart, path: '/admin/health' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Admin Panel</h2>
            <nav className="space-y-2">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/incidents" element={<IncidentManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/health" element={<HealthDashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Settings Component
const AdminSettings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoAssign: false,
    alertThreshold: 100,
    responseTime: 15
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Settings</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">System Configuration</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-600">Enable real-time notifications for critical incidents</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Auto-Assign Incidents</h3>
              <p className="text-sm text-gray-600">Automatically assign incidents to available staff</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoAssign}
                onChange={(e) => handleSettingChange('autoAssign', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crowd Alert Threshold
            </label>
            <input
              type="number"
              value={settings.alertThreshold}
              onChange={(e) => handleSettingChange('alertThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter threshold value"
            />
            <p className="text-sm text-gray-500 mt-1">Number of people that triggers a crowd alert</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Response Time (minutes)
            </label>
            <input
              type="number"
              value={settings.responseTime}
              onChange={(e) => handleSettingChange('responseTime', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter response time"
            />
            <p className="text-sm text-gray-500 mt-1">Target time for responding to incidents</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
