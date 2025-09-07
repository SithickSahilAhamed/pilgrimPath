import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  Droplets,
  Shield,
  Users,
  Download
} from 'lucide-react';

const HealthDashboard = () => {
  const [healthData, setHealthData] = useState({
    overview: {
      publicHealthScore: 85,
      totalPeople: 125000,
      healthComplaints: 23,
      diseaseOutbreaks: 0,
      infectionRate: 2.3,
      sanitationScore: 88,
      waterQuality: 'good',
      medicalUtilization: 65
    },
    sectorData: [
      {
        sector: 'A',
        healthScore: 82,
        people: 25000,
        complaints: 8,
        outbreaks: 0,
        sanitation: 85,
        waterQuality: 'good',
        medicalUtilization: 70
      },
      {
        sector: 'B',
        healthScore: 88,
        people: 30000,
        complaints: 5,
        outbreaks: 0,
        sanitation: 92,
        waterQuality: 'excellent',
        medicalUtilization: 45
      },
      {
        sector: 'C',
        healthScore: 79,
        people: 20000,
        complaints: 6,
        outbreaks: 0,
        sanitation: 78,
        waterQuality: 'fair',
        medicalUtilization: 80
      },
      {
        sector: 'D',
        healthScore: 91,
        people: 25000,
        complaints: 2,
        outbreaks: 0,
        sanitation: 95,
        waterQuality: 'excellent',
        medicalUtilization: 55
      },
      {
        sector: 'E',
        healthScore: 76,
        people: 25000,
        complaints: 2,
        outbreaks: 0,
        sanitation: 72,
        waterQuality: 'good',
        medicalUtilization: 75
      }
    ],
    alerts: [
      {
        id: 1,
        type: 'water',
        severity: 'medium',
        message: 'Water quality below optimal in Sector C',
        location: 'Sector C - Water Station 3',
        timestamp: '2024-01-15T09:30:00Z',
        isResolved: false
      },
      {
        id: 2,
        type: 'sanitation',
        severity: 'low',
        message: 'Sanitation facilities need restocking in Sector A',
        location: 'Sector A - Restroom Block 2',
        timestamp: '2024-01-15T08:45:00Z',
        isResolved: false
      }
    ],
    trends: [
      { date: '2024-01-09', healthScore: 83, infectionRate: 2.1, complaints: 15 },
      { date: '2024-01-10', healthScore: 84, infectionRate: 2.0, complaints: 12 },
      { date: '2024-01-11', healthScore: 85, infectionRate: 1.9, complaints: 18 },
      { date: '2024-01-12', healthScore: 86, infectionRate: 2.2, complaints: 14 },
      { date: '2024-01-13', healthScore: 84, infectionRate: 2.4, complaints: 16 },
      { date: '2024-01-14', healthScore: 85, infectionRate: 2.3, complaints: 20 },
      { date: '2024-01-15', healthScore: 85, infectionRate: 2.3, complaints: 23 }
    ]
  });

  const getHealthScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getWaterQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health & Hygiene Dashboard</h1>
        <button
          onClick={() => console.log('Export health data')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Public Health Score</p>
              <p className="text-2xl font-bold text-gray-900">{healthData.overview.publicHealthScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total People</p>
              <p className="text-2xl font-bold text-gray-900">{healthData.overview.totalPeople.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Health Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{healthData.overview.healthComplaints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Infection Rate</p>
              <p className="text-2xl font-bold text-gray-900">{healthData.overview.infectionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Health Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sector Health Status</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaints</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sanitation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water Quality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Utilization</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {healthData.sectorData.map((sector) => (
                <tr key={sector.sector} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {sector.sector}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getHealthScoreColor(sector.healthScore)}`}>
                      {sector.healthScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sector.people.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sector.complaints}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sector.sanitation}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getWaterQualityColor(sector.waterQuality)}`}>
                      {sector.waterQuality}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sector.medicalUtilization}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Health Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Health Alerts</h2>
          <div className="space-y-4">
            {healthData.alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                'bg-green-50 border-green-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-sm text-gray-500">{formatTime(alert.timestamp)}</span>
                    </div>
                    <h3 className="font-medium text-gray-900">{alert.message}</h3>
                    <p className="text-sm text-gray-600 mt-1">{alert.location}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <AlertTriangle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Trends Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Health Trends</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Health trends chart would be displayed here</p>
              <p className="text-sm text-gray-500">Showing health score, infection rate, and complaints over time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Quality Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Excellent</span>
              <span className="font-semibold text-green-600">2 sectors</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Good</span>
              <span className="font-semibold text-blue-600">2 sectors</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fair</span>
              <span className="font-semibold text-yellow-600">1 sector</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Poor</span>
              <span className="font-semibold text-red-600">0 sectors</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sanitation Overview</h3>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-blue-600 mb-2">{healthData.overview.sanitationScore}%</div>
            <p className="text-gray-600">Average Sanitation Score</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Above 90%</span>
              <span className="text-green-600 font-semibold">2 sectors</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>80-90%</span>
              <span className="text-blue-600 font-semibold">2 sectors</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Below 80%</span>
              <span className="text-orange-600 font-semibold">1 sector</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Facilities</h3>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-purple-600 mb-2">{healthData.overview.medicalUtilization}%</div>
            <p className="text-gray-600">Average Utilization</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Available Beds</span>
              <span className="font-semibold">450</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Occupied Beds</span>
              <span className="font-semibold">293</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Emergency Cases</span>
              <span className="text-red-600 font-semibold">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;
