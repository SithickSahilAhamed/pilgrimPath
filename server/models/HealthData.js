const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  sector: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    totalPeople: {
      type: Number,
      default: 0
    },
    healthComplaints: {
      type: Number,
      default: 0
    },
    diseaseOutbreaks: [{
      disease: String,
      cases: Number,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      }
    }],
    infectionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    sanitationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    waterQuality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    },
    medicalFacilities: {
      available: Number,
      occupied: Number,
      utilizationRate: Number
    },
    hygieneAlerts: [{
      type: {
        type: String,
        enum: ['water', 'sanitation', 'food', 'waste', 'other']
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      description: String,
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number]
      },
      reportedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved'],
        default: 'open'
      }
    }],
    publicHealthScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  alerts: [{
    type: {
      type: String,
      enum: ['outbreak', 'sanitation', 'water', 'medical', 'hygiene']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isResolved: {
      type: Boolean,
      default: false
    }
  }],
  aiPredictions: {
    nextOutbreakRisk: {
      type: Number,
      min: 0,
      max: 100
    },
    recommendedActions: [String],
    confidence: Number
  }
}, {
  timestamps: true
});

healthDataSchema.index({ sector: 1, date: -1 });
healthDataSchema.index({ 'metrics.publicHealthScore': 1 });

module.exports = mongoose.model('HealthData', healthDataSchema);
