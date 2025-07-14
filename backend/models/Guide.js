const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  specialties: { type: [String], required: true },
  languages: { type: [String], required: true },
  experience: { type: Number, required: true },
  rate: { type: Number, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  destinations: [{
    name: String,
    type: String
  }],
  images: [String]
}, { timestamps: true });

module.exports = mongoose.model('Guide', GuideSchema);
