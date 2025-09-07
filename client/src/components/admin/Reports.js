import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('incidents');
  const [dateRange, setDateRange] = useState('7d');
  const [format, setFormat] = useState('pdf');

  const reportTypes = [
    { id: 'incidents', name: 'Incident Report', icon: FileText },
    { id: 'health', name: 'Health & Hygiene Report', icon: FileText },
    { id: 'analytics', name: 'Analytics Report', icon: FileText },
    { id: 'summary', name: 'Executive Summary', icon: FileText }
  ];

  const generateReport = () => {
    console.log(`Generating ${reportType} report for ${dateRange} in ${format} format`);
    // In real app, this would call the API to generate the report
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports & Exports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Report</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setReportType(type.id)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          reportType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Icon className="h-6 w-6 text-gray-600 mb-2" />
                        <div className="font-medium text-gray-900">{type.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                  </select>
                </div>
              </div>

              <button
                onClick={generateReport}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Incident Report</div>
                  <div className="text-sm text-gray-600">Jan 15, 2024</div>
                </div>
                <button className="text-blue-600 hover:text-blue-700">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Health Report</div>
                  <div className="text-sm text-gray-600">Jan 14, 2024</div>
                </div>
                <button className="text-blue-600 hover:text-blue-700">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
