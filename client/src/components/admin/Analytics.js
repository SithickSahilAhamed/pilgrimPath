import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Users,
  Activity,
  Download
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalIncidents: 156,
      resolvedIncidents: 142,
      criticalIncidents: 8,
      emergencyIncidents: 3,
      aiDetectedIncidents: 45,
      avgResponseTime: 12.5
    },
    categoryStats: [
      { category: 'crowding', count: 45, avgResponseTime: 8.2 },
      { category: 'health', count: 32, avgResponseTime: 15.3 },
      { category: 'lost_item', count: 28, avgResponseTime: 4.1 },
      { category: 'safety', count: 25, avgResponseTime: 18.7 },
      { category: 'sanitation', count: 18, avgResponseTime: 12.4 },
      { category: 'transport', count: 8, avgResponseTime: 6.8 }
    ],
    sectorStats: [
      { sector: 'A', count: 45, critical: 3 },
      { sector: 'B', count: 38, critical: 2 },
      { sector: 'C', count: 32, critical: 1 },
      { sector: 'D', count: 28, critical: 2 },
      { sector: 'E', count: 13, critical: 0 }
    ],
    timeSeriesData: [
      { date: '2024-01-09', open: 5, in_progress: 3, resolved: 12 },
      { date: '2024-01-10', open: 8, in_progress: 4, resolved: 15 },
      { date: '2024-01-11', open: 6, in_progress: 5, resolved: 18 },
      { date: '2024-01-12', open: 12, in_progress: 6, resolved: 14 },
      { date: '2024-01-13', open: 9, in_progress: 4, resolved: 16 },
      { date: '2024-01-14', open: 7, in_progress: 3, resolved: 19 },
      { date: '2024-01-15', open: 4, in_progress: 2, resolved: 8 }
    ],
    aiComparison: [
      { type: 'AI Detected', count: 45, avgResponseTime: 6.2, resolutionRate: 0.89 },
      { type: 'Manual', count: 111, avgResponseTime: 15.8, resolutionRate: 0.76 }
    ]
  });

  const getCategoryColor = (category) => {
    const colors = {
      crowding: 'bg-red-500',
      health: 'bg-blue-500',
      lost_item: 'bg-green-500',
      safety: 'bg-orange-500',
      sanitation: 'bg-purple-500',
      transport: 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes.toFixed(1)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toFixed(0)}m`;
  };

  const exportData = (format) => {
    // Simulate data export
    console.log(`Exporting analytics data as ${format}`);
    // In real app, this would generate and download the file
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={() => exportData('csv')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalIncidents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.resolvedIncidents}</p>
              <p className="text-sm text-green-600">
                {((analytics.overview.resolvedIncidents / analytics.overview.totalIncidents) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(analytics.overview.avgResponseTime)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Detected</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.aiDetectedIncidents}</p>
              <p className="text-sm text-purple-600">
                {((analytics.overview.aiDetectedIncidents / analytics.overview.totalIncidents) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Incidents by Category</h2>
          <div className="space-y-4">
            {analytics.categoryStats.map((stat) => (
              <div key={stat.category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${getCategoryColor(stat.category)} mr-3`}></div>
                  <span className="font-medium text-gray-900 capitalize">
                    {stat.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{stat.count}</div>
                  <div className="text-sm text-gray-500">{formatTime(stat.avgResponseTime)} avg</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sector Performance</h2>
          <div className="space-y-4">
            {analytics.sectorStats.map((stat) => (
              <div key={stat.sector} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-3">
                    {stat.sector}
                  </div>
                  <span className="font-medium text-gray-900">Sector {stat.sector}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{stat.count} incidents</div>
                  <div className="text-sm text-red-600">{stat.critical} critical</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Incident Trends</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Interactive chart would be displayed here</p>
            <p className="text-sm text-gray-500">Using libraries like Chart.js or Recharts</p>
          </div>
        </div>
      </div>

      {/* AI vs Manual Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">AI vs Manual Response</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analytics.aiComparison.map((comparison) => (
            <div key={comparison.type} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">{comparison.type}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Incidents:</span>
                  <span className="font-semibold">{comparison.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response Time:</span>
                  <span className="font-semibold">{formatTime(comparison.avgResponseTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolution Rate:</span>
                  <span className="font-semibold">{(comparison.resolutionRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Improvement</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">-28%</div>
            <p className="text-gray-600">Compared to last month</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Detection Rate</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">28.8%</div>
            <p className="text-gray-600">Of incidents detected by AI</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Rate</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">91.0%</div>
            <p className="text-gray-600">Of incidents resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
