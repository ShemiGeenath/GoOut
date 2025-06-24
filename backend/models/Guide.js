const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const GuideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  specialties: {
    type: [String],
    required: [true, 'At least one specialty is required'],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one specialty is required'
    }
  },
  languages: {
    type: [String],
    required: [true, 'At least one language is required'],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one language is required'
    }
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: [0, 'Rate cannot be negative']
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  destinations: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }],
  images: [{
    type: String,
    validate: {
      validator: function(arr) {
        return arr.length <= 5;
      },
      message: 'Cannot upload more than 5 images'
    }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for formatted rate
GuideSchema.virtual('formattedRate').get(function() {
  return `Rs. ${this.rate.toFixed(2)}/hour`;
});

// Indexes for better performance
GuideSchema.index({ name: 'text', bio: 'text' });
GuideSchema.index({ userId: 1 });
GuideSchema.index({ rate: 1 });
GuideSchema.index({ specialties: 1 });
GuideSchema.index({ languages: 1 });
GuideSchema.index({ 'destinations.name': 1 });
GuideSchema.index({ 'destinations.type': 1 });
GuideSchema.index({ createdAt: -1 });

// Update timestamp on save
GuideSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add pagination plugin
GuideSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Guide', GuideSchema);