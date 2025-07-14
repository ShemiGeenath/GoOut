const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  type: String,
  price: Number,
  capacity: Number,
  quantity: Number,
  description: String,
});

const hotelSchema = new mongoose.Schema({
  propertyName: { type: String, required: true },
  propertyType: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  contactPhone: { type: String },
  contactEmail: { type: String },
  stars: { type: Number, default: 3 },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  priceRange: { type: String },
  hasRestaurant: { type: Boolean },
  hasPool: { type: Boolean },
  amenities: [String],
  rooms: [roomSchema],
  images: [String],
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);
