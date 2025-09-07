const express = require('express');
const { body, validationResult } = require('express-validator');
const Incident = require('../models/Incident');
const { auth, moderatorAuth } = require('../middleware/auth');

const router = express.Router();

// Get all incidents with filters
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      priority,
      category,
      sector,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (sector) filter['location.sector'] = sector;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const incidents = await Incident.find(filter)
      .populate('reporter', 'name email phone')
      .populate('assignedTo', 'name email phone')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Incident.countDocuments(filter);

    res.json({
      incidents,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get incident by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reporter', 'name email phone')
      .populate('assignedTo', 'name email phone')
      .populate('notes.author', 'name');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    console.error('Get incident error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new incident
router.post('/', auth, [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['crowding', 'health', 'lost_item', 'safety', 'sanitation', 'transport', 'other']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be [longitude, latitude]')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const incidentData = {
      ...req.body,
      reporter: req.userId
    };

    const incident = new Incident(incidentData);
    await incident.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('new-incident', incident);

    res.status(201).json({
      message: 'Incident reported successfully',
      incident
    });
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update incident status
router.put('/:id/status', auth, moderatorAuth, [
  body('status').isIn(['open', 'in_progress', 'resolved', 'closed']),
  body('assignedTo').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, assignedTo } = req.body;
    const updateData = { status };

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    if (status === 'in_progress' && !req.body.firstResponse) {
      updateData['responseTime.firstResponse'] = new Date();
    }

    if (status === 'resolved') {
      updateData['responseTime.resolved'] = new Date();
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('reporter', 'name email phone')
     .populate('assignedTo', 'name email phone');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('incident-updated', incident);

    res.json({
      message: 'Incident status updated successfully',
      incident
    });
  } catch (error) {
    console.error('Update incident error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add note to incident
router.post('/:id/notes', auth, [
  body('text').trim().isLength({ min: 1 }).withMessage('Note text is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = {
      text: req.body.text,
      author: req.userId,
      timestamp: new Date()
    };

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: note } },
      { new: true }
    ).populate('notes.author', 'name');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('incident-note-added', { incidentId: req.params.id, note });

    res.json({
      message: 'Note added successfully',
      incident
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get incidents by location (nearby)
router.get('/nearby/:lng/:lat', auth, async (req, res) => {
  try {
    const { lng, lat } = req.params;
    const { radius = 1000 } = req.query; // radius in meters

    const incidents = await Incident.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).populate('reporter', 'name phone');

    res.json(incidents);
  } catch (error) {
    console.error('Get nearby incidents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get incident statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await Incident.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } },
          emergency: { $sum: { $cond: ['$isEmergency', 1, 0] } }
        }
      }
    ]);

    const avgResponseTime = await Incident.aggregate([
      {
        $match: {
          'responseTime.resolved': { $exists: true }
        }
      },
      {
        $project: {
          responseTime: {
            $subtract: ['$responseTime.resolved', '$responseTime.reported']
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);

    res.json({
      ...stats[0],
      avgResponseTime: avgResponseTime[0]?.avgResponseTime || 0
    });
  } catch (error) {
    console.error('Get incident stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
