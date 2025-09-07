import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle,
  Clock,
  MapPin,
  User,
  MessageSquare
} from 'lucide-react';

const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Mock incident data
    setIncidents([
      {
        id: 1,
        title: 'Crowding at Main Ghat',
        category: 'crowding',
        priority: 'high',
        status: 'in_progress',
        description: 'Extreme crowding observed at the main ghat area. People are unable to move freely.',
        location: {
          address: 'Main Ghat, Sector A',
          coordinates: [77.2090, 28.6139]
        },
        reporter: {
          name: 'John Doe',
          phone: '+91 9876543210'
        },
        assignedTo: {
          name: 'Security Team A',
          phone: '+91 9876543211'
        },
        reportedAt: '2024-01-15T10:30:00Z',
        firstResponse: '2024-01-15T10:35:00Z',
        notes: [
          {
            id: 1,
            text: 'Security team dispatched to the location',
            author: 'Admin User',
            timestamp: '2024-01-15T10:35:00Z'
          },
          {
            id: 2,
            text: 'Crowd control measures implemented',
            author: 'Security Team A',
            timestamp: '2024-01-15T10:45:00Z'
          }
        ]
      },
      {
        id: 2,
        title: 'Medical Emergency - Sector B',
        category: 'health',
        priority: 'critical',
        status: 'open',
        description: 'Person collapsed near food court. Requires immediate medical attention.',
        location: {
          address: 'Food Court, Sector B',
          coordinates: [77.2080, 28.6145]
        },
        reporter: {
          name: 'Jane Smith',
          phone: '+91 9876543212'
        },
        assignedTo: null,
        reportedAt: '2024-01-15T10:15:00Z',
        firstResponse: null,
        notes: []
      },
      {
        id: 3,
        title: 'Lost Item Report',
        category: 'lost_item',
        priority: 'medium',
        status: 'resolved',
        description: 'Lost mobile phone near parking area. Black iPhone 13.',
        location: {
          address: 'Parking Area, Sector C',
          coordinates: [77.2110, 28.6135]
        },
        reporter: {
          name: 'Mike Johnson',
          phone: '+91 9876543213'
        },
        assignedTo: {
          name: 'Lost & Found Team',
          phone: '+91 9876543214'
        },
        reportedAt: '2024-01-15T09:45:00Z',
        firstResponse: '2024-01-15T09:50:00Z',
        resolvedAt: '2024-01-15T11:30:00Z',
        notes: [
          {
            id: 1,
            text: 'Item found and returned to owner',
            author: 'Lost & Found Team',
            timestamp: '2024-01-15T11:30:00Z'
          }
        ]
      }
    ]);
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

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filters.status !== 'all' && incident.status !== filters.status) return false;
    if (filters.priority !== 'all' && incident.priority !== filters.priority) return false;
    if (filters.category !== 'all' && incident.category !== filters.category) return false;
    if (filters.search && !incident.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = (incidentId, newStatus) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { 
            ...incident, 
            status: newStatus,
            ...(newStatus === 'resolved' && { resolvedAt: new Date().toISOString() })
          }
        : incident
    ));
  };

  const handleAssign = (incidentId, assignee) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { ...incident, assignedTo: assignee }
        : incident
    ));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Incident Management</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search incidents..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="crowding">Crowding</option>
              <option value="health">Health</option>
              <option value="lost_item">Lost Item</option>
              <option value="safety">Safety</option>
              <option value="sanitation">Sanitation</option>
              <option value="transport">Transport</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Incidents ({filteredIncidents.length})</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredIncidents.map((incident) => (
            <div key={incident.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(incident.priority)}`}>
                      {incident.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{incident.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {incident.location.address}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {incident.reporter.name}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDateTime(incident.reportedAt)}
                    </div>
                  </div>

                  {incident.assignedTo && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Assigned to:</strong> {incident.assignedTo.name}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedIncident(incident);
                      setShowDetails(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {incident.status === 'open' && (
                    <button
                      onClick={() => handleStatusChange(incident.id, 'in_progress')}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Start
                    </button>
                  )}
                  
                  {incident.status === 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange(incident.id, 'resolved')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Details Modal */}
      {showDetails && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedIncident.title}</h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedIncident.priority)}`}>
                      {selectedIncident.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedIncident.status)}`}>
                      {selectedIncident.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900">{selectedIncident.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900">{selectedIncident.location.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reporter</label>
                      <p className="text-gray-900">{selectedIncident.reporter.name} - {selectedIncident.reporter.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reported At</label>
                      <p className="text-gray-900">{formatDateTime(selectedIncident.reportedAt)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedIncident.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900">{note.text}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {note.author} • {formatDateTime(note.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <textarea
                      placeholder="Add a note..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentManagement;
