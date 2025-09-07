const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      fullAddress: String
    },
    sector: String
  },
  type: {
    type: String,
    enum: ['single', 'double', 'family', 'dormitory', 'tent'],
    required: true
  },
  capacity: {
    adults: {
      type: Number,
      required: true,
      min: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  price: {
    perNight: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'ac', 'fan', 'bathroom', 'kitchen', 'parking', 'security', 'laundry', 'food', 'water']
  }],
  images: [{
    url: String,
    filename: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  availability: {
    startDate: Date,
    endDate: Date,
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  rules: [String],
  contactInfo: {
    phone: String,
    email: String,
    whatsapp: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for geospatial queries
roomSchema.index({ location: '2dsphere' });
roomSchema.index({ sector: 1, isActive: 1 });
roomSchema.index({ price: 1, type: 1 });

module.exports = mongoose.model('Room', roomSchema);
