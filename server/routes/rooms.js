const express = require('express');
const { body, validationResult } = require('express-validator');
const Room = require('../models/Room');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all rooms with filters
router.get('/', async (req, res) => {
  try {
    const {
      sector,
      type,
      minPrice,
      maxPrice,
      amenities,
      coordinates,
      radius = 5000,
      page = 1,
      limit = 10
    } = req.query;

    let filter = { isActive: true, verificationStatus: 'verified' };
    
    if (sector) filter.sector = sector;
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter['price.perNight'] = {};
      if (minPrice) filter['price.perNight'].$gte = parseInt(minPrice);
      if (maxPrice) filter['price.perNight'].$lte = parseInt(maxPrice);
    }
    if (amenities) {
      filter.amenities = { $in: amenities.split(',') };
    }

    let query = Room.find(filter);

    // Location-based search
    if (coordinates) {
      const [lng, lat] = coordinates.split(',').map(Number);
      query = query.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: parseInt(radius)
          }
        }
      });
    }

    const rooms = await query
      .populate('owner', 'name phone')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Room.countDocuments(filter);

    res.json({
      rooms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('owner', 'name phone email')
      .populate('reviews.user', 'name');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new room listing
router.post('/', auth, [
  body('title').trim().isLength({ min: 5 }),
  body('description').trim().isLength({ min: 20 }),
  body('type').isIn(['single', 'double', 'family', 'dormitory', 'tent']),
  body('capacity.adults').isInt({ min: 1 }),
  body('price.perNight').isFloat({ min: 0 }),
  body('location.coordinates').isArray({ min: 2, max: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const roomData = {
      ...req.body,
      owner: req.userId
    };

    const room = new Room(roomData);
    await room.save();

    res.status(201).json({
      message: 'Room listing created successfully',
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review to room
router.post('/:id/reviews', auth, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const review = {
      user: req.userId,
      rating,
      comment,
      createdAt: new Date()
    };

    room.reviews.push(review);
    
    // Update average rating
    const totalRating = room.reviews.reduce((sum, review) => sum + review.rating, 0);
    room.rating.average = totalRating / room.reviews.length;
    room.rating.count = room.reviews.length;

    await room.save();

    res.json({
      message: 'Review added successfully',
      room
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
