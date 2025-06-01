const mongoose = require('mongoose');

// Sub-schema for daily hours
const hoursDaySchema = new mongoose.Schema({
  open: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Open time must be in HH:MM format (24-hour)'],
    required: [true, 'Open time is required']
  },
  close: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Close time must be in HH:MM format (24-hour)'],
    required: [true, 'Close time is required']
  }
});

// Sub-schema for permanence
const permanenceSchema = new mongoose.Schema({
  isOnDuty: {
    type: Boolean,
    default: false
  },
  days: {
    type: [String],
    default: []
  }
});

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pharmacy name is required'],
    trim: true
  },
  name_ar: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true
  },
  region_ar: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  hours: {
    type: {
      Monday: { type: hoursDaySchema, required: true },
      Tuesday: { type: hoursDaySchema, required: true },
      Wednesday: { type: hoursDaySchema, required: true },
      Thursday: { type: hoursDaySchema, required: true },
      Friday: { type: hoursDaySchema, required: true },
      Saturday: { type: hoursDaySchema, required: true },
      Sunday: { type: hoursDaySchema, required: true }
    },
    required: [true, 'Operating hours are required']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  permanence: {
    type: permanenceSchema,
    required: [true, 'Permanence information is required']
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'closed',
    required: [true, 'Status is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ GeoSpatial index for location
pharmacySchema.index({ location: '2dsphere' });

// ✅ Full-text search index
pharmacySchema.index({ 
  name: 'text', 
  name_ar: 'text',
  city: 'text', 
  region: 'text',
  region_ar: 'text'
});

// Status logic
pharmacySchema.methods.calculateStatus = function (currentTime = new Date()) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[currentTime.getDay()];
  const hoursToday = this.hours[today];

  if (!hoursToday) return 'closed';

  const [openHour, openMinute] = hoursToday.open.split(':').map(Number);
  const [closeHour, closeMinute] = hoursToday.close.split(':').map(Number);
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes ? 'open' : 'closed';
};

// Auto-calculate status on save
pharmacySchema.pre('save', function (next) {
  if (this.isModified('hours') || this.status === 'closed') {
    this.status = this.calculateStatus();
  }
  next();
});


module.exports = mongoose.model('Pharmacy', pharmacySchema);
