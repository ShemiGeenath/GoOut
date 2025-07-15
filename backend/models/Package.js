const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  packageName: String,
  packageType: String,
  destination: String,
  duration: String,
  price: Number,
  groupSize: String,
  overview: String,
  itinerary: String,
  departureDates: [String],
  included: [String],
  activities: [String],
  highlights: String,
  terms: String,
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Package', packageSchema);
