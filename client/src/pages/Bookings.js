import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Bus, 
  Home as HomeIcon, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star,
  Filter,
  Search,
  Plus
} from 'lucide-react';

const Bookings = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'transport');
  const [bookings, setBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    date: '',
    type: 'all'
  });
  const { t } = useLanguage();

  // Mock booking data
  const mockBookings = [
    {
      id: 1,
      type: 'transport',
      route: 'Main Gate to Temple Complex',
      vehicle: 'Shuttle Bus',
      scheduledTime: '2024-01-15T10:00:00Z',
      passengers: 2,
      status: 'confirmed',
      price: 100,
      bookingDate: '2024-01-14T15:30:00Z'
    },
    {
      id: 2,
      type: 'accommodation',
      room: 'Deluxe Room - Sector A',
      checkIn: '2024-01-15T14:00:00Z',
      checkOut: '2024-01-17T11:00:00Z',
      guests: 2,
      status: 'pending',
      price: 2500,
      bookingDate: '2024-01-14T16:45:00Z'
    }
  ];

  const transportRoutes = [
    {
      id: 1,
      name: 'Main Shuttle Route',
      from: 'Station A',
      to: 'Temple Complex',
      duration: '15 min',
      price: 50,
      capacity: 20,
      frequency: 'Every 10 minutes',
      status: 'active'
    },
    {
      id: 2,
      name: 'E-Rickshaw Zone 1',
      from: 'Parking Lot 1',
      to: 'Main Ghat',
      duration: '8 min',
      price: 30,
      capacity: 4,
      frequency: 'On demand',
      status: 'active'
    }
  ];

  const accommodationOptions = [
    {
      id: 1,
      title: 'Deluxe Room - Sector A',
      type: 'double',
      capacity: 2,
      price: 1250,
      amenities: ['AC', 'WiFi', 'Bathroom'],
      rating: 4.5,
      reviews: 23,
      location: 'Sector A, Near Main Gate',
      images: ['room1.jpg']
    },
    {
      id: 2,
      title: 'Family Tent - Sector B',
      type: 'tent',
      capacity: 4,
      price: 800,
      amenities: ['Fan', 'Bathroom'],
      rating: 4.2,
      reviews: 15,
      location: 'Sector B, Riverside',
      images: ['tent1.jpg']
    }
  ];

  useEffect(() => {
    setBookings(mockBookings);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredBookings = bookings.filter(booking => {
    if (filters.status !== 'all' && booking.status !== filters.status) return false;
    if (filters.type !== 'all' && booking.type !== filters.type) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('bookings')}</h1>
          <p className="text-gray-600">Manage your transport and accommodation bookings</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('transport')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transport'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Bus className="h-5 w-5 inline mr-2" />
                {t('transport')}
              </button>
              <button
                onClick={() => setActiveTab('accommodation')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'accommodation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <HomeIcon className="h-5 w-5 inline mr-2" />
                {t('accommodation')}
              </button>
              <button
                onClick={() => setActiveTab('my-bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="h-5 w-5 inline mr-2" />
                {t('myBookings')}
              </button>
            </nav>
          </div>
        </div>

        {/* Transport Tab */}
        {activeTab === 'transport' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Transport</h2>
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Book Transport
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transportRoutes.map((route) => (
                <div key={route.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {route.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {route.from} → {route.to}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {route.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Capacity: {route.capacity}
                    </div>
                    <div className="text-sm text-gray-600">
                      Frequency: {route.frequency}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">₹{route.price}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                      {t('bookNow')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accommodation Tab */}
        {activeTab === 'accommodation' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Accommodation</h2>
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Book Accommodation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodationOptions.map((room) => (
                <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <HomeIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{room.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{room.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({room.reviews})</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{room.location}</p>
                    
                    <div className="space-y-1 mb-4">
                      <div className="text-sm text-gray-600">
                        Type: {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Capacity: {room.capacity} guests
                      </div>
                      <div className="text-sm text-gray-600">
                        Amenities: {room.amenities.join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">₹{room.price}/night</span>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        {t('bookNow')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'my-bookings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('myBookings')}</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {booking.type === 'transport' ? (
                        <Bus className="h-6 w-6 text-blue-600 mr-3" />
                      ) : (
                        <HomeIcon className="h-6 w-6 text-green-600 mr-3" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.type === 'transport' ? booking.route : booking.room}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Booked on {formatDate(booking.bookingDate)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Time</p>
                      <p className="font-medium">{formatDate(booking.scheduledTime || booking.checkIn)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {booking.type === 'transport' ? 'Passengers' : 'Guests'}
                      </p>
                      <p className="font-medium">{booking.passengers || booking.guests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="font-medium text-lg">₹{booking.price}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      View Details
                    </button>
                    {booking.status === 'pending' && (
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600">You haven't made any bookings yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
