const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mock transport data - in real app, this would come from a database
const transportRoutes = [
  {
    id: 1,
    name: 'Main Shuttle Route',
    type: 'shuttle',
    from: { name: 'Station A', coordinates: [77.2090, 28.6139] },
    to: { name: 'Temple Complex', coordinates: [77.2090, 28.6140] },
    duration: 15,
    price: 50,
    capacity: 20,
    frequency: 'Every 10 minutes',
    status: 'active'
  },
  {
    id: 2,
    name: 'E-Rickshaw Zone 1',
    type: 'e_rickshaw',
    from: { name: 'Parking Lot 1', coordinates: [77.2100, 28.6140] },
    to: { name: 'Main Ghat', coordinates: [77.2095, 28.6145] },
    duration: 8,
    price: 30,
    capacity: 4,
    frequency: 'On demand',
    status: 'active'
  }
];

// Get available transport routes
router.get('/routes', async (req, res) => {
  try {
    const { from, to, type } = req.query;
    
    let routes = transportRoutes.filter(route => route.status === 'active');
    
    if (type) {
      routes = routes.filter(route => route.type === type);
    }
    
    if (from && to) {
      // In real app, this would use proper routing algorithm
      routes = routes.filter(route => 
        route.from.name.toLowerCase().includes(from.toLowerCase()) ||
        route.to.name.toLowerCase().includes(to.toLowerCase())
      );
    }

    res.json(routes);
  } catch (error) {
    console.error('Get transport routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book transport
router.post('/book', auth, [
  body('routeId').isInt({ min: 1 }),
  body('scheduledTime').isISO8601(),
  body('passengers').isInt({ min: 1 }),
  body('contactInfo.name').trim().isLength({ min: 2 }),
  body('contactInfo.phone').isMobilePhone()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { routeId, scheduledTime, passengers, contactInfo, specialRequests } = req.body;
    
    const route = transportRoutes.find(r => r.id === routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    if (passengers > route.capacity) {
      return res.status(400).json({ message: 'Exceeds vehicle capacity' });
    }

    const booking = {
      id: Date.now(),
      routeId,
      route,
      user: req.userId,
      scheduledTime: new Date(scheduledTime),
      passengers,
      contactInfo,
      specialRequests,
      status: 'pending',
      totalPrice: route.price * passengers,
      createdAt: new Date()
    };

    // In real app, save to database
    res.status(201).json({
      message: 'Transport booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Book transport error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get real-time transport status
router.get('/status', async (req, res) => {
  try {
    const status = {
      activeVehicles: 45,
      totalCapacity: 1200,
      currentLoad: 850,
      averageWaitTime: 5, // minutes
      routes: transportRoutes.map(route => ({
        id: route.id,
        name: route.name,
        currentLoad: Math.floor(Math.random() * route.capacity),
        waitTime: Math.floor(Math.random() * 15) + 1
      }))
    };

    res.json(status);
  } catch (error) {
    console.error('Get transport status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
