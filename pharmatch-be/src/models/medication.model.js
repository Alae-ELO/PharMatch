const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const medicationSchema = new mongoose.Schema({
  name: {
    en: {
      type: String,
      required: [true, 'English medication name is required'],
      trim: true
    },
    ar: {
      type: String,
      required: [true, 'Arabic medication name is required'],
      trim: true
    },
    fr: {
      type: String,
      required: [true, 'French medication name is required'],
      trim: true
    }
  },
  description: {
    en: {
      type: String,
      required: [true, 'English description is required'],
      trim: true
    },
    ar: {
      type: String,
      required: [true, 'Arabic description is required'],
      trim: true
    },
    fr: {
      type: String,
      required: [true, 'French description is required'],
      trim: true
    }
  },
  category: {
    en: {
      type: String,
      required: [true, 'English category is required'],
      trim: true
    },
    ar: {
      type: String,
      required: [true, 'Arabic category is required'],
      trim: true
    },
    fr: {
      type: String,
      required: [true, 'French category is required'],
      trim: true
    }
  },
  prescription: {
    type: Boolean,
    default: false
  },
  image_url: {
    type: String,
    trim: true
  },
  pharmacies: [
    {
      pharmacy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true
      },
      inStock: {
        type: Boolean,
        default: true
      },
      price: {
        type: Number,
        default: 0,
        min: [0, 'Price cannot be negative']
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add pagination plugin
medicationSchema.plugin(mongoosePaginate);

// Add text index for search
medicationSchema.index({ 
  'name.en': 'text', 
  'name.ar': 'text', 
  'name.fr': 'text',
  'description.en': 'text', 
  'description.ar': 'text', 
  'description.fr': 'text',
  'category.en': 'text', 
  'category.ar': 'text', 
  'category.fr': 'text'
});

module.exports = mongoose.model('Medication', medicationSchema);