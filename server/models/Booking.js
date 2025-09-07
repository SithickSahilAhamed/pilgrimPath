const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['transport', 'accommodation'],
    required: true
  },
  transportDetails: {
    vehicleType: {
      type: String,
      enum: ['shuttle', 'e_rickshaw', 'bus']
    },
    route: {
      from: {
        name: String,
        coordinates: [Number]
      },
      to: {
        name: String,
        coordinates: [Number]
      }
    },
    scheduledTime: Date,
    estimatedDuration: Number, // in minutes
    capacity: Number,
    price: Number
  },
  accommodationDetails: {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    checkIn: Date,
    checkOut: Date,
    guests: Number,
    price: Number,
    amenities: [String]
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'wallet']
    },
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    transactionId: String
  },
  specialRequests: String,
  contactInfo: {
    name: String,
    phone: String,
    email: String
  }
}, {
  timestamps: true
});

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1, type: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
