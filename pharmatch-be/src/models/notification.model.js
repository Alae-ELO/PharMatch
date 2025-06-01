const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['blood', 'medication', 'system'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification must be associated with a user']
  },
  relatedItem: {
    // This could be a medication, blood donation request, etc.
    itemId: mongoose.Schema.Types.ObjectId,
    itemType: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
});


// Add index for user to quickly find notifications for a specific user
notificationSchema.index({ user: 1, read: 1 });

// Add index for expiration date to easily clean up old notifications
notificationSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Notification', notificationSchema);