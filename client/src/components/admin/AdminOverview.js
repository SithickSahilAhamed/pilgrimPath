import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  MapPin,
  Activity,
  Shield,
  Heart
} from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalPeople: 125000,
    activeIncidents: 12,
    resolvedToday: 45,
    avgResponseTime: 8.5,
    healthScore: 85,
    criticalAlerts: 3
  });

  const [recentIncidents, setRecentIncidents] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalPeople: prev.totalPeople + Math.floor(Math.random() * 100) - 50,
        avgResponseTime: Math.max(1, prev.avgResponseTime + (Math.random() - 0.5) * 2)
      }));
    }, 5000);

    // Mock data
    setRecentIncidents([
      {
        id: 1,
        title: 'Crowding at Main Ghat',
        priority: 'high',
        status: 'in_progress',
        reportedAt: '2024-01-15T10:30:00Z',
        sector: 'A'
      },
      {
        id: 2,
        title: 'Medical Emergency - Sector B',
        priority: 'critical',
        status: 'open',
        reportedAt: '2024-01-15T10:15:00Z',
        sector: 'B'
      },
      {
        id: 3,
        title: 'Lost Item Report',
        priority: 'medium',
        status: 'resolved',
        reportedAt: '2024-01-15T09:45:00Z',
        sector: 'C'
      }
    ]);

    setLiveAlerts([
      {
        id: 1,
        type: 'crowd',
        message: 'High crowd density detected in Sector A',
        severity: 'high',
        timestamp: '2024-01-15T10:35:00Z'
      },
      {
        id: 2,
        type: 'health',
        message: 'Water quality alert in Sector B',
        severity: 'medium',
        timestamp: '2024-01-15T10:20:00Z'
      }
    ]);

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total People</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPeople.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeIncidents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime.toFixed(1)}m</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Health Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.healthScore}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Incidents */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Incidents</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{incident.title}</h3>
                    <p className="text-sm text-gray-600">Sector {incident.sector} • {formatTime(incident.reportedAt)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(incident.priority)}`}>
                      {incident.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="w-full text-blue-600 hover:text-blue-700 font-medium">
                View All Incidents →
              </button>
            </div>
          </div>
        </div>

        {/* Live Alerts */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Live Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {liveAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-start">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 mr-3 ${
                      alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{alert.message}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatTime(alert.timestamp)} • {alert.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="w-full text-blue-600 hover:text-blue-700 font-medium">
                View All Alerts →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow">
            <MapPin className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sector Monitoring</h3>
            <p className="text-gray-600">Monitor real-time crowd density and asset status across all sectors</p>
          </button>

          <button className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow">
            <Activity className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Dashboard</h3>
            <p className="text-gray-600">Track public health metrics and disease outbreak alerts</p>
          </button>

          <button className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">View detailed analytics and performance metrics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
