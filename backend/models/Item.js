const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ItemSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Camping Gear',
      'Vehicles',
      'Accessories',
      'Adventure Services',
      'Campsite Rentals',
      'Travel Packages',
      'Photography/Drones',
      'Local Guides & Drivers',
      'Water Adventures',
      'Second-Hand Items',
      'Eco-Friendly Essentials',
      'Travel Buddy Finder'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  rentalType: {
    type: String,
    required: [true, 'Rental type is required'],
    enum: ['sell', 'rent'],
    default: 'sell'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
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
  images: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr.length <= 5;
      },
      message: 'Cannot upload more than 5 images'
    }
  },
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

// Virtual for formatted price
ItemSchema.virtual('formattedPrice').get(function() {
  return `Rs. ${this.price.toFixed(2)}`;
});

// Indexes for better performance
ItemSchema.index({ title: 'text', description: 'text' });
ItemSchema.index({ userId: 1 });
ItemSchema.index({ price: 1 });
ItemSchema.index({ category: 1 });
ItemSchema.index({ rentalType: 1 });
ItemSchema.index({ createdAt: -1 });

// Update timestamp on save
ItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add pagination plugin
ItemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Item', ItemSchema);
