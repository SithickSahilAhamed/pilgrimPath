const express = require('express');
const Incident = require('../models/Incident');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get analytics overview
router.get('/overview', auth, adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = {};
    if (Object.keys(dateFilter).length > 0) {
      matchStage.createdAt = dateFilter;
    }

    const analytics = await Incident.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalIncidents: { $sum: 1 },
          resolvedIncidents: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          criticalIncidents: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } },
          emergencyIncidents: { $sum: { $cond: ['$isEmergency', 1, 0] } },
          aiDetectedIncidents: { $sum: { $cond: ['$aiDetected', 1, 0] } },
          avgResponseTime: {
            $avg: {
              $cond: [
                { $and: ['$responseTime.firstResponse', '$responseTime.reported'] },
                { $subtract: ['$responseTime.firstResponse', '$responseTime.reported'] },
                null
              ]
            }
          }
        }
      }
    ]);

    const categoryStats = await Incident.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgResponseTime: {
            $avg: {
              $cond: [
                { $and: ['$responseTime.firstResponse', '$responseTime.reported'] },
                { $subtract: ['$responseTime.firstResponse', '$responseTime.reported'] },
                null
              ]
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const sectorStats = await Incident.aggregate([
      { $match: { ...matchStage, 'location.sector': { $exists: true } } },
      {
        $group: {
          _id: '$location.sector',
          count: { $sum: 1 },
          critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: analytics[0] || {
        totalIncidents: 0,
        resolvedIncidents: 0,
        criticalIncidents: 0,
        emergencyIncidents: 0,
        aiDetectedIncidents: 0,
        avgResponseTime: 0
      },
      categoryStats,
      sectorStats
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get time-series data for charts
router.get('/timeseries', auth, adminAuth, async (req, res) => {
  try {
    const { days = 7, groupBy = 'day' } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    let groupFormat;
    switch (groupBy) {
      case 'hour':
        groupFormat = { $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' } };
        break;
      case 'day':
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'week':
        groupFormat = { $dateToString: { format: '%Y-%U', date: '$createdAt' } };
        break;
      default:
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }

    const timeSeriesData = await Incident.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: groupFormat,
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          data: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(timeSeriesData);
  } catch (error) {
    console.error('Get timeseries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get AI vs Manual comparison
router.get('/ai-comparison', auth, adminAuth, async (req, res) => {
  try {
    const comparison = await Incident.aggregate([
      {
        $group: {
          _id: '$aiDetected',
          count: { $sum: 1 },
          avgResponseTime: {
            $avg: {
              $cond: [
                { $and: ['$responseTime.firstResponse', '$responseTime.reported'] },
                { $subtract: ['$responseTime.firstResponse', '$responseTime.reported'] },
                null
              ]
            }
          },
          resolutionRate: {
            $avg: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(comparison);
  } catch (error) {
    console.error('Get AI comparison error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
