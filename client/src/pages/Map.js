import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  MapPin, 
  Navigation, 
  Users, 
  AlertTriangle, 
  Filter,
  RefreshCw,
  Layers,
  Info
} from 'lucide-react';

const Map = () => {
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [crowdData, setCrowdData] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    crowdDensity: 'all',
    incidentType: 'all',
    transport: 'all'
  });
  const mapRef = useRef(null);
  const { t } = useLanguage();

  // Mock crowd data
  const mockCrowdData = [
    {
      id: 1,
      name: 'Main Ghat',
      coordinates: [77.2090, 28.6139],
      crowdDensity: 'high',
      color: '#ef4444',
      peopleCount: 2500,
      incidents: 2,
      lastUpdated: new Date()
    },
    {
      id: 2,
      name: 'Temple Complex',
      coordinates: [77.2100, 28.6140],
      crowdDensity: 'medium',
      color: '#f59e0b',
      peopleCount: 1200,
      incidents: 0,
      lastUpdated: new Date()
    },
    {
      id: 3,
      name: 'Food Court',
      coordinates: [77.2080, 28.6145],
      crowdDensity: 'low',
      color: '#10b981',
      peopleCount: 300,
      incidents: 1,
      lastUpdated: new Date()
    },
    {
      id: 4,
      name: 'Parking Area',
      coordinates: [77.2110, 28.6135],
      crowdDensity: 'medium',
      color: '#f59e0b',
      peopleCount: 800,
      incidents: 0,
      lastUpdated: new Date()
    }
  ];

  const suggestedRoutes = [
    {
      id: 1,
      name: 'Quick Route to Temple',
      from: 'Main Gate',
      to: 'Temple Complex',
      duration: '15 min',
      difficulty: 'Easy',
      crowdLevel: 'Low',
      color: '#10b981'
    },
    {
      id: 2,
      name: 'Scenic Route',
      from: 'Main Gate',
      to: 'Temple Complex',
      duration: '25 min',
      difficulty: 'Medium',
      crowdLevel: 'Medium',
      color: '#f59e0b'
    },
    {
      id: 3,
      name: 'Emergency Route',
      from: 'Main Gate',
      to: 'Temple Complex',
      duration: '10 min',
      difficulty: 'Easy',
      crowdLevel: 'Low',
      color: '#ef4444'
    }
  ];

  useEffect(() => {
    // Initialize map
    if (mapRef.current && !map) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 15,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(mapInstance);
    }
  }, []);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Update crowd data periodically
    const interval = setInterval(() => {
      setCrowdData(prevData => 
        prevData.map(location => ({
          ...location,
          peopleCount: location.peopleCount + Math.floor(Math.random() * 100) - 50,
          lastUpdated: new Date()
        }))
      );
    }, 10000);

    setCrowdData(mockCrowdData);
    return () => clearInterval(interval);
  }, []);

  const getCrowdDensityColor = (density) => {
    switch (density) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCrowdDensityText = (density) => {
    switch (density) {
      case 'low': return t('green');
      case 'medium': return t('yellow');
      case 'high': return t('red');
      default: return 'Unknown';
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredCrowdData = crowdData.filter(location => {
    if (filters.crowdDensity !== 'all' && location.crowdDensity !== filters.crowdDensity) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Map Controls */}
          <div className="absolute top-4 left-4 space-y-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white rounded-lg shadow-md p-3 hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-white rounded-lg shadow-md p-3 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Current Location Button */}
          {currentLocation && (
            <button
              onClick={() => {
                if (map) {
                  map.setCenter(currentLocation);
                  map.setZoom(18);
                }
              }}
              className="absolute top-4 right-4 bg-blue-600 text-white rounded-lg shadow-md p-3 hover:bg-blue-700 transition-colors"
            >
              <Navigation className="h-5 w-5" />
            </button>
          )}

          {/* Crowd Density Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{t('crowdDensity')}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">{t('green')} (0-500)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600">{t('yellow')} (500-1500)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">{t('red')} (1500+)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Map Data</h2>
            
            {/* Filters */}
            {showFilters && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Filters</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crowd Density
                    </label>
                    <select
                      value={filters.crowdDensity}
                      onChange={(e) => handleFilterChange('crowdDensity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Levels</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Crowd Data */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Crowd Status</h3>
              <div className="space-y-3">
                {filteredCrowdData.map((location) => (
                  <div key={location.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{location.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        location.crowdDensity === 'high' ? 'bg-red-100 text-red-800' :
                        location.crowdDensity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {getCrowdDensityText(location.crowdDensity)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {location.peopleCount.toLocaleString()}
                      </span>
                      {location.incidents > 0 && (
                        <span className="flex items-center text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {location.incidents}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Updated {location.lastUpdated.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Routes */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{t('suggestedRoutes')}</h3>
              <div className="space-y-3">
                {suggestedRoutes.map((route) => (
                  <div
                    key={route.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRoute?.id === route.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{route.name}</h4>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: route.color }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{route.from} → {route.to}</p>
                      <p>Duration: {route.duration}</p>
                      <p>Crowd Level: {route.crowdLevel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
