const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medication name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  prescription: {
    type: Boolean,
    default: false
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
        min: 0
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
medicationSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Medication', medicationSchema);