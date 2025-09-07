const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Mock notifications - in real app, this would be stored in database
let notifications = [
  {
    id: 1,
    title: 'Crowd Alert',
    message: 'High crowd density detected in Sector A. Please use alternative routes.',
    type: 'alert',
    priority: 'high',
    sector: 'A',
    timestamp: new Date(),
    isRead: false
  },
  {
    id: 2,
    title: 'Emergency Update',
    message: 'Medical emergency reported near Main Ghat. Emergency services dispatched.',
    type: 'emergency',
    priority: 'critical',
    sector: 'B',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    isRead: false
  }
];

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, priority } = req.query;
    
    let filteredNotifications = [...notifications];
    
    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }
    
    if (priority) {
      filteredNotifications = filteredNotifications.filter(n => n.priority === priority);
    }

    // Sort by timestamp (newest first)
    filteredNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    res.json({
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      unreadCount: filteredNotifications.filter(n => !n.isRead).length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = notifications.find(n => n.id === parseInt(req.params.id));
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    notification.readAt = new Date();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    notifications.forEach(notification => {
      notification.isRead = true;
      notification.readAt = new Date();
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification (admin only)
router.post('/', auth, adminAuth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required'),
  body('type').isIn(['alert', 'emergency', 'info', 'update']),
  body('priority').isIn(['low', 'medium', 'high', 'critical'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const notification = {
      id: Date.now(),
      ...req.body,
      timestamp: new Date(),
      isRead: false
    };

    notifications.unshift(notification);

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('new-notification', notification);

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notification statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      byType: {
        alert: notifications.filter(n => n.type === 'alert').length,
        emergency: notifications.filter(n => n.type === 'emergency').length,
        info: notifications.filter(n => n.type === 'info').length,
        update: notifications.filter(n => n.type === 'update').length
      },
      byPriority: {
        low: notifications.filter(n => n.priority === 'low').length,
        medium: notifications.filter(n => n.priority === 'medium').length,
        high: notifications.filter(n => n.priority === 'high').length,
        critical: notifications.filter(n => n.priority === 'critical').length
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
