const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const bloodDonationSchema = new mongoose.Schema({
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  contactInfo: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'fulfilled', 'expired'],
    default: 'active'
  },
  donors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    donationDate: Date,
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  }]
});

// Add pagination plugin
bloodDonationSchema.plugin(mongoosePaginate);

// Add index for blood type and urgency for faster queries
bloodDonationSchema.index({ bloodType: 1, urgency: 1 });

// Add index for expiration date to easily find active requests
bloodDonationSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('BloodDonation', bloodDonationSchema);