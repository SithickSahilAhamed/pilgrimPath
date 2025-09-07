import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Search, 
  MapPin, 
  Bell, 
  AlertTriangle, 
  Bus, 
  Home as HomeIcon, 
  MessageSquare,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [crowdStats, setCrowdStats] = useState({
    totalPeople: 125000,
    currentDensity: 'Medium',
    activeIncidents: 3,
    avgWaitTime: 8
  });
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { notifications } = useNotifications();

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setCrowdStats(prev => ({
        ...prev,
        totalPeople: prev.totalPeople + Math.floor(Math.random() * 100) - 50,
        avgWaitTime: Math.max(1, prev.avgWaitTime + Math.floor(Math.random() * 6) - 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Get recent alerts from notifications
    const alerts = notifications
      .filter(notification => notification.type === 'alert' || notification.type === 'emergency')
      .slice(0, 3);
    setLiveAlerts(alerts);
  }, [notifications]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/map?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickActions = [
    {
      icon: AlertTriangle,
      title: t('reportIssue'),
      description: 'Report crowding, health issues, or lost items',
      color: 'bg-red-500',
      onClick: () => navigate('/complaints')
    },
    {
      icon: Bus,
      title: t('bookTransport'),
      description: 'Book shuttle or e-rickshaw rides',
      color: 'bg-blue-500',
      onClick: () => navigate('/bookings?type=transport')
    },
    {
      icon: HomeIcon,
      title: t('findAccommodation'),
      description: 'Find rooms and homestays',
      color: 'bg-green-500',
      onClick: () => navigate('/bookings?type=accommodation')
    },
    {
      icon: MessageSquare,
      title: t('emergencyHelp'),
      description: 'Get help from our multilingual chatbot',
      color: 'bg-purple-500',
      onClick: () => navigate('/chatbot')
    }
  ];

  const getDensityColor = (density) => {
    switch (density.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('welcome')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Smart crowd management for large events
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total People</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crowdStats.totalPeople.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Crowd Density</p>
                <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getDensityColor(crowdStats.currentDensity)}`}>
                  {crowdStats.currentDensity}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Incidents</p>
                <p className="text-2xl font-bold text-gray-900">{crowdStats.activeIncidents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold text-gray-900">{crowdStats.avgWaitTime} min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Alerts */}
        {liveAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Bell className="h-6 w-6 text-red-500 mr-2" />
              {t('liveAlerts')}
            </h2>
            <div className="space-y-3">
              {liveAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.priority === 'critical' || alert.type === 'emergency'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-yellow-50 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 mr-3 ${
                      alert.priority === 'critical' || alert.type === 'emergency'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
                >
                  <div className={`inline-flex p-3 rounded-lg ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Live Map</h2>
            <button
              onClick={() => navigate('/map')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View Full Map →
            </button>
          </div>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map with real-time crowd data</p>
              <button
                onClick={() => navigate('/map')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
