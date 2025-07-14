const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/hotels';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPEG/PNG/WEBP images allowed'));
  }
});

// ✅ POST: Create new hotel
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const {
      propertyName, propertyType, description, location, contactPhone,
      contactEmail, stars, checkInTime, checkOutTime, priceRange,
      hasRestaurant, hasPool, amenities, rooms
    } = req.body;

    const hotel = new Hotel({
      propertyName,
      propertyType,
      description,
      location,
      contactPhone,
      contactEmail,
      stars: Number(stars) || 3,
      checkInTime,
      checkOutTime,
      priceRange,
      hasRestaurant: hasRestaurant === 'true',
      hasPool: hasPool === 'true',
      amenities: JSON.parse(amenities),
      rooms: JSON.parse(rooms),
      images: req.files.map(f => f.path),
    });

    const saved = await hotel.save();
    res.status(201).json({ message: 'Hotel created', id: saved._id });
  } catch (err) {
    console.error('[❌ Hotel Submit Error]', err);
    req.files?.forEach(f => fs.unlinkSync(f.path));
    res.status(500).json({ error: 'Hotel creation failed', details: err.message });
  }
});

// ✅ GET all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// ✅ GET one hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching hotel' });
  }
});

// ✅ DELETE hotel
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

    hotel.images.forEach(imgPath => {
      fs.unlink(imgPath, err => {
        if (err) console.warn('⚠️ Failed to delete image:', imgPath);
      });
    });

    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});

module.exports = router;
