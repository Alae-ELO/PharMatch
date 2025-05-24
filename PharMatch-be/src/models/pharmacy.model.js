const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pharmacy name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  hours: {
    type: String,
    required: [true, 'Operating hours are required'],
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Pharmacy must have an owner']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add pagination plugin
pharmacySchema.plugin(mongoosePaginate);

// Add index for geospatial queries
pharmacySchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

// Add text index for search
pharmacySchema.index({ name: 'text', city: 'text', address: 'text' });

module.exports = mongoose.model('Pharmacy', pharmacySchema);