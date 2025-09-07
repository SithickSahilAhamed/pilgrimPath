const express = require('express');
const HealthData = require('../models/HealthData');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get health dashboard data
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const { sector } = req.query;
    
    const filter = {};
    if (sector) filter.sector = sector;

    const latestData = await HealthData.findOne(filter)
      .sort({ createdAt: -1 });

    const sectorData = await HealthData.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$sector',
          latestScore: { $last: '$metrics.publicHealthScore' },
          avgScore: { $avg: '$metrics.publicHealthScore' },
          totalAlerts: { $sum: { $size: '$alerts' } },
          activeAlerts: {
            $sum: {
              $size: {
                $filter: {
                  input: '$alerts',
                  cond: { $eq: ['$$this.isResolved', false] }
                }
              }
            }
          }
        }
      }
    ]);

    res.json({
      latest: latestData,
      sectorData
    });
  } catch (error) {
    console.error('Get health dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get health trends
router.get('/trends', auth, adminAuth, async (req, res) => {
  try {
    const { days = 7, sector } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const filter = { createdAt: { $gte: startDate } };
    if (sector) filter.sector = sector;

    const trends = await HealthData.find(filter)
      .select('sector createdAt metrics.publicHealthScore metrics.infectionRate metrics.sanitationScore')
      .sort({ createdAt: 1 });

    res.json(trends);
  } catch (error) {
    console.error('Get health trends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create health data entry
router.post('/', auth, adminAuth, [
  require('express-validator').body('sector').trim().isLength({ min: 1 }),
  require('express-validator').body('metrics').isObject()
], async (req, res) => {
  try {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const healthData = new HealthData(req.body);
    await healthData.save();

    res.status(201).json({
      message: 'Health data created successfully',
      healthData
    });
  } catch (error) {
    console.error('Create health data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active health alerts
router.get('/alerts', auth, async (req, res) => {
  try {
    const alerts = await HealthData.aggregate([
      { $unwind: '$alerts' },
      { $match: { 'alerts.isResolved': false } },
      {
        $project: {
          sector: 1,
          alert: '$alerts',
          createdAt: 1
        }
      },
      { $sort: { 'alert.timestamp': -1 } }
    ]);

    res.json(alerts);
  } catch (error) {
    console.error('Get health alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
