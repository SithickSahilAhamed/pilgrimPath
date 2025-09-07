const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['crowding', 'health', 'lost_item', 'safety', 'sanitation', 'transport', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String,
    sector: String
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video']
    },
    url: String,
    filename: String
  }],
  tags: [String],
  estimatedCrowdSize: {
    type: Number,
    min: 0
  },
  responseTime: {
    reported: {
      type: Date,
      default: Date.now
    },
    firstResponse: Date,
    resolved: Date
  },
  notes: [{
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isEmergency: {
    type: Boolean,
    default: false
  },
  aiDetected: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for geospatial queries
incidentSchema.index({ location: '2dsphere' });
incidentSchema.index({ status: 1, priority: 1 });
incidentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Incident', incidentSchema);
